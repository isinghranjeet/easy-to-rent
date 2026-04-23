export const WhatsAppButton = () => {
  const whatsappNumber = "9315058665";
  const defaultMessage = encodeURIComponent(
    "Hello, I need assistance with PG accommodation near Chandigarh University."
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-40"
      title="Contact via WhatsApp"
    >
      <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.52 3.49C18.18 1.13 15.19 0 12 0A12 12 0 0 0 0 12c0 2.07.55 4.06 1.59 5.77L0 24l6.33-1.55A12 12 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.25-6.19-3.48-8.51zM12 22c-1.92 0-3.78-.55-5.38-1.58l-.39-.24-3.95 1 1.06-3.85-.25-.39A10 10 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.53-14.2c-.15-.25-.54-.27-.77-.15-2.1 1.04-4.87 1.3-6.85.48-2.02-.83-3.69-2.96-3.8-3.1-.1-.14-.3-.2-.5-.2-.2 0-.4.1-.5.2-.1.14-.8 1.1-.8 2.64 0 1.54 1.1 3.06 1.25 3.27.15.2 2.16 3.24 5.26 4.5 3.1 1.26 3.1.84 3.65.78.56-.07 1.8-.73 2.05-1.44.25-.7.25-1.3.18-1.44-.08-.14-.23-.22-.38-.27z" />
      </svg>
    </a>
  );
};
