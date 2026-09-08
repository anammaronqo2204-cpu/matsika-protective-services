import { Mail, MapPin, Phone } from "lucide-react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import ContactForm from "@/components/contact-form";
import { Reveal } from "@/components/ui";
import { COMPANY } from "@/lib/constants";

export default function ContactPage() {
  return (
    <div className="bg-ink text-cream">
      <SiteNav />
      <main>
        <section className="border-b border-line bg-black">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-8">
            <p className="rise rise-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Contact</p>
            <h1 className="rise rise-2 mt-6 max-w-3xl text-[42px] font-semibold leading-[1.1] tracking-[-0.035em] text-white md:text-[56px]">
              Discuss your security requirements with our team.
            </h1>
            <p className="rise rise-3 mt-6 max-w-2xl text-[15px] leading-7 text-mist">
              Send us the basic details of your site or requirement. We will contact you to understand the scope and arrange an assessment where appropriate.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:px-8 lg:grid-cols-[360px_1fr]">
          <Reveal>
            <h2 className="text-[22px] font-semibold text-white">Direct contact</h2>
            <div className="mt-8 space-y-0 border-t border-line">
              <a href={`tel:${COMPANY.emergency.replace(/\s/g, "")}`} className="group flex gap-4 border-b border-line py-5 transition-all duration-300 hover:border-gold/50 hover:pl-1">
                <Phone size={18} className="mt-1 shrink-0 text-gold" />
                <span><span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-dim">24-hour contact</span><span className="mt-1 block text-[15px] font-semibold text-white transition-colors group-hover:text-gold">{COMPANY.emergency}</span></span>
              </a>
              <a href={`mailto:${COMPANY.email}`} className="group flex gap-4 border-b border-line py-5 transition-all duration-300 hover:border-gold/50 hover:pl-1">
                <Mail size={18} className="mt-1 shrink-0 text-gold" />
                <span><span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-dim">Email</span><span className="mt-1 block text-[14px] font-semibold text-white transition-colors group-hover:text-gold">{COMPANY.email}</span></span>
              </a>
              <div className="flex gap-4 border-b border-line py-5">
                <MapPin size={18} className="mt-1 shrink-0 text-gold" />
                <span><span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-dim">Office</span><span className="mt-1 block text-[14px] leading-6 text-white">{COMPANY.address}</span></span>
              </div>
            </div>
            <div className="mt-8 border-l-2 border-gold pl-5 transition-colors duration-300 hover:border-gold-pale">
              <p className="text-[12px] leading-6 text-dim">
                For officer applications, use the dedicated recruitment portal rather than this enquiry form.
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <ContactForm />
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
