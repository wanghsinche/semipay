import xml2js from 'xml2js';
import { promisify } from 'util';
const promiseXMLParser = promisify(xml2js.parseString);

function valid(e: string) {
  return Boolean(e) &&( e.startsWith('wx') || e.startsWith('http') || !/^\w+$/.test(e))
}


export async function xmlFormatter(xmlString: string) {
  try {
    const result = await promiseXMLParser(xmlString);
    const textArray = [] as string[];
    // Recursively iterate over the object to extract text content
    function extractText(obj: Record<string, unknown> | unknown) {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }
      for (const key in obj) {
        if (['string', 'number', 'boolean'].includes(typeof (obj as Record<string, unknown>)[key])) {
          textArray.push((obj as Record<string, string>)[key]);
        } else if (typeof (obj as Record<string, unknown>)[key] === 'object') {
          extractText((obj as Record<string, unknown>)[key]);
        }
      }
    }
    extractText(result);

    return textArray.map(e => e.trim()).filter(e => valid(e));

  } catch (error) {
    return [xmlString]
  }
}


export function cdataFormatter(text: string) {
  const cdataRegex = /<!\[CDATA\[(.*?)\]\]>/gs;
  const matches = text.matchAll(cdataRegex);
  const lines = [] as string[];
  // Loop through the matches and extract the contents
  for (const match of matches) {
    const cdataContent = match[1];
    lines.push(cdataContent);
  }

  return lines.map(e => e.trim()).filter(e => valid(e))
}


export async function formatter(text: string) {
  const xmlText = await xmlFormatter(text);
  const cdataText = cdataFormatter(text);
  const uniqText = new Set([...xmlText, ...cdataText]);

  const finalText = Array.from(uniqText).join('\n');

  return finalText
}