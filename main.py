import os
import requests
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters

BOT_TOKEN = "7947219468:AAFJhdgNa1Z8tKYw2i_C4ypOEv2RXbGyZXo"  # توکن رباتت اینجاست

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("سلام! لینک مستقیم فایل رو بفرست تا برات دانلود و ارسال کنم.")

async def download_file(update: Update, context: ContextTypes.DEFAULT_TYPE):
    url = update.message.text.strip()
    try:
        filename = url.split("/")[-1]
        await update.message.reply_text("در حال دانلود فایل...")
        response = requests.get(url, stream=True)
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        await update.message.reply_document(document=open(filename, 'rb'))
        os.remove(filename)
    except Exception as e:
        await update.message.reply_text(f"خطا در دریافت فایل: {e}")

if __name__ == "__main__":
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, download_file))
    print("ربات فعال شد.")
    app.run_polling()
