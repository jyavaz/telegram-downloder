export default {
  async fetch(request, env, ctx) {
    const TELEGRAM_TOKEN = "8199106929:AAE0ZcRYL4As0ntPx5CbxhklhRM_utRuQEo";
    const MAX_SIZE = 100 * 1024 * 1024;

    if (request.method !== 'POST') return new Response('Only POST allowed', { status: 405 });

    const data = await request.json();
    const message = data.message;
    if (!message || !message.text) return new Response('No text found', { status: 200 });

    const url = message.text.trim();
    const chat_id = message.chat.id;

    try {
      const headResp = await fetch(url, { method: 'HEAD' });
      const size = parseInt(headResp.headers.get('content-length') || '0');

      if (size > MAX_SIZE) {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id, text: "فایل بزرگ‌تر از ۱۰۰ مگابایت است." })
        });
        return new Response("Too large", { status: 200 });
      }

      const fileResp = await fetch(url);
      const fileBlob = await fileResp.blob();

      const form = new FormData();
      form.append("chat_id", chat_id);
      form.append("caption", "@RelaxMusic");
      form.append("document", new File([fileBlob], "file", { type: "application/octet-stream" }));

      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
        method: "POST",
        body: form
      });

    } catch (e) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text: "خطایی رخ داد هنگام دریافت فایل." })
      });
    }

    return new Response("Done", { status: 200 });
  }
}
