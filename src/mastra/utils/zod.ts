import { z } from "zod";

type AnyZod = z.ZodTypeAny;
type AnyZodObject = z.ZodObject<z.ZodRawShape>;

function friendlyTypeName(t: string): string {
  switch (t) {
    case "ZodString": return "string";
    case "ZodNumber": return "number";
    case "ZodBoolean": return "boolean";
    case "ZodArray": return "array";
    case "ZodObject": return "object";
    case "ZodUnion": return "union";
    case "ZodLiteral": return "literal";
    case "ZodEnum": return "enum";
    case "ZodOptional": return "optional";
    case "ZodNullable": return "nullable";
    default: return t.replace(/^Zod/, "").toLowerCase();
  }
}

export function schemaToDescription(schema: AnyZod, indent = 0): string {
  const pad = " ".repeat(indent);

  const t = schema._def.typeName;

  if (t === "ZodObject") {
    const shape = (schema as AnyZodObject).shape;
    const entries = Object.entries(shape) as [string, AnyZod][];
    return entries
      .map(([key, value]) => `${pad}${key}: ${schemaToDescription(value, indent + 2)}`)
      .join("\n");
  }

  if (t === "ZodArray") {
    const inner = (schema as z.ZodArray<AnyZod>)._def.type as AnyZod;
    return `array<${schemaToDescription(inner)}>`;
  }

  if (t === "ZodUnion") {
    const options = (schema as z.ZodUnion<[AnyZod, ...AnyZod[]]>)._def.options as AnyZod[];
    return options.map(o => schemaToDescription(o)).join(" | ");
  }

  if (t === "ZodOptional") {
    const inner = (schema as z.ZodOptional<AnyZod>)._def.innerType as AnyZod;
    return `${schemaToDescription(inner)}?`;
  }

  if (t === "ZodNullable") {
    const inner = (schema as z.ZodNullable<AnyZod>)._def.innerType as AnyZod;
    return `${schemaToDescription(inner)} | null`;
  }

  if (t === "ZodEnum") {
    const values = (schema as z.ZodEnum<[string, ...string[]]>)._def.values;
    return `enum(${values.map(v => JSON.stringify(v)).join(", ")})`;
  }

  const description = schema.description ? ` - ${schema.description}` : "";
  return `${friendlyTypeName(t)}${description}`;
}
