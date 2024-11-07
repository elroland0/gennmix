"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Switch } from "../ui/switch";
import { ColorPickers } from "../blocks/color-pickers";

export function GenForm<T extends z.ZodTypeAny>({
  ai,
  title,
  schema,
  submitText,
  isSubmitting,
  onSubmit,
}: {
  ai: "openai" | "recraft" | "ideogram";
  title: string;
  schema: T;
  submitText: string;
  onSubmit: (values: z.infer<T> & { apiKey: string }) => void;
  isSubmitting: boolean;
}) {
  const [rememberApiKey, setRememberApiKey] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema.and(z.object({ apiKey: z.string().min(1) }))),
    defaultValues: { ...getDefaults(schema), apiKey: "" },
  });

  useEffect(() => {
    const apiKey = localStorage.getItem(`${ai}-api-key`);
    if (apiKey) {
      setRememberApiKey(true);
      form.setValue("apiKey", apiKey);
    }
  }, [rememberApiKey]);

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit((data) => {
              if (!rememberApiKey) {
                localStorage.removeItem(`${ai}-api-key`);
              } else {
                localStorage.setItem(`${ai}-api-key`, data.apiKey);
              }
              onSubmit(data as z.infer<T> & { apiKey: string });
            })}
          >
            {generateField(form.control, form.getValues, schema, {})}

            <FormField
              key="apiKey"
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>API Key</FormLabel>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        remember
                      </span>
                      <Switch
                        checked={rememberApiKey}
                        onCheckedChange={(checked) => {
                          setRememberApiKey(checked);
                        }}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircledIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            This will save your API key in the browser&apos;s
                            local storage.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                className={cn(
                  "font-normal",
                  isSubmitting && "animate-pulse disabled:opacity-75"
                )}
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                {submitText}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function getDefaults<Schema extends z.ZodTypeAny>(
  schema: Schema
): Record<string, any> | undefined {
  if (schema instanceof z.ZodIntersection) {
    return {
      ...getDefaults(schema._def.left),
      ...getDefaults(schema._def.right),
    };
  }
  if (schema instanceof z.ZodObject) {
    return Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]) => {
        if (value instanceof z.ZodDefault)
          return [key, value._def.defaultValue()];
        return [key, undefined];
      })
    );
  }
  if (schema instanceof z.ZodDefault) {
    return schema._def.defaultValue();
  }
  return undefined;
}

function generateField(
  control: any,
  getValues: () => { [k: string]: any },
  schema: z.ZodTypeAny,
  { name, optional }: { name?: string; optional?: boolean }
): React.ReactNode {
  if (schema instanceof z.ZodObject) {
    return Object.entries(schema.shape).map(([name, schema]: [string, any]) =>
      generateField(control, getValues, schema, { name, optional })
    );
  }
  if (schema instanceof z.ZodDefault) {
    return generateField(control, getValues, schema._def.innerType, {
      name,
      optional,
    });
  }
  if (schema instanceof z.ZodOptional) {
    return generateField(control, getValues, schema._def.innerType, {
      name,
      optional: true,
    });
  }
  if (schema instanceof z.ZodIntersection) {
    return [
      generateField(control, getValues, schema._def.left, {
        name,
        optional,
      }),
      generateField(control, getValues, schema._def.right, {
        name,
        optional,
      }),
    ];
  }
  if (schema instanceof z.ZodDiscriminatedUnion) {
    const discriminators = z.enum(
      Array.from(schema._def.optionsMap.keys()) as [string, ...string[]]
    );
    const selected = schema._def.optionsMap.get(
      getValues()[schema._def.discriminator]
    );
    return [
      generateField(control, getValues, discriminators, {
        name: schema._def.discriminator,
      }),
      ...Object.entries(selected?.shape ?? {})
        .filter(([name]) => name !== schema._def.discriminator)
        .map(([name, schema]) =>
          generateField(control, getValues, schema, { name, optional })
        ),
    ];
  }

  if (!name) return null;

  return (
    <FormField
      key={name}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel htmlFor={name}>
              {name[0].toUpperCase() + name.slice(1)}
            </FormLabel>
            {optional && (
              <FormDescription className="text-xs">optional</FormDescription>
            )}
          </div>
          <FormControl>
            {schema instanceof z.ZodString ? (
              schema.description === "textarea" ? (
                <Textarea id={name} {...field} />
              ) : (
                <Input
                  id={name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )
            ) : schema instanceof z.ZodNumber ? (
              <Input id={name} type="number" {...field} />
            ) : schema instanceof z.ZodEnum ? (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={field.disabled}
              >
                <SelectTrigger id={name}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {schema.options.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : name === "colors" && schema instanceof z.ZodArray ? (
              <ColorPickers
                id={name}
                onChange={(colors) =>
                  field.onChange(colors.map((c) => [c.r, c.g, c.b]))
                }
              />
            ) : schema instanceof z.ZodEffects ? (
              <Input
                id={name}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  console.log(e.target.files);
                  field.onChange(e.target.files?.[0] ?? undefined);
                }}
              />
            ) : null}
          </FormControl>
        </FormItem>
      )}
    />
  );
}
