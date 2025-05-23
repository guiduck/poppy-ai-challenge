export async function uploadToImgBB(
  base64Image: string
): Promise<string | null> {
  const form = new FormData();
  form.append("image", base64Image);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    {
      method: "POST",
      body: form,
    }
  );

  if (!response.ok) {
    console.error("Erro ao fazer upload para ImgBB:", await response.text());
    return null;
  }

  const result = await response.json();
  return result.data?.url ?? null;
}
