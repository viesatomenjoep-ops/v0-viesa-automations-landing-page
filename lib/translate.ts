export async function translateText(text: string, toCode: string, fromCode: string = 'nl') {
  if (!text) return '';
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromCode}&tl=${toCode}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    return data[0].map((x: any) => x[0]).join('');
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}
