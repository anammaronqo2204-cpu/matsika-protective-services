import type { Metadata } from "next";
import { Reveal, SectionLabel } from "@/components/ui";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Legal, Privacy & POPIA",
  description:
    "Privacy notice, POPIA notice, terms of use, data retention policy and candidate rights for Matsika Protective Services.",
};

const SECTIONS = [
  {
    id: "privacy",
    title: "Privacy Notice",
    paras: [
      `${COMPANY.name}, a division and trading identity of ${COMPANY.legal}, collects personal information for the purposes of providing security services, responding to enquiries, and recruiting, verifying and employing security officers.`,
      "We collect only what is necessary: identification details, contact details, PSiRA registration and grading, employment and training history, references, and supporting documents you choose to upload. Client enquiries capture contact and site details necessary to survey and quote.",
      "Information is stored on access-controlled infrastructure. Only authorised personnel with a legitimate operational need may view candidate records, and every access-relevant action taken inside our administration portal is written to an audit log.",
    ],
  },
  {
    id: "popia",
    title: "POPIA Notice",
    paras: [
      "We process personal information in accordance with the Protection of Personal Information Act, 4 of 2013 (POPIA). The responsible party is Matsika Legacy Holdings (Pty) Ltd.",
      "Lawful basis: candidate information is processed on the basis of your explicit consent, given at registration, and for the purposes of taking steps to conclude a possible employment contract. Client information is processed to perform or prepare a contract with you.",
      "We do not sell personal information. We do not share candidate information with third parties except where required for verification (for example, confirming PSiRA standing through official processes), where you have provided references, or where the law compels disclosure.",
    ],
  },
  {
    id: "terms",
    title: "Terms of Use",
    paras: [
      "This website and its careers portal are provided for information and recruitment purposes. Registering a profile does not create an employment relationship, does not constitute an offer of employment, and does not guarantee deployment.",
      "This platform is not a PSiRA registration platform. Registration with the Private Security Industry Regulatory Authority must be completed directly through PSiRA. Any PSiRA information supplied by an applicant is subject to independent verification.",
      "Service descriptions, response times and statistics on this site are indicative and are formalised only in a signed service level agreement.",
    ],
  },
  {
    id: "retention",
    title: "Data Retention Policy",
    paras: [
      "Candidate records are retained in the talent pool for 24 months from the date of the last interaction, after which they are archived or deleted unless you ask us to retain them for longer or a legal obligation requires retention.",
      "Records relating to appointed employees are retained for the periods prescribed by South African labour, tax and private security legislation.",
      "Uploaded documents are retained for as long as the associated candidate record exists and are deleted together with it.",
    ],
  },
  {
    id: "rights",
    title: "Candidate & Data Subject Rights",
    paras: [
      "You have the right to request access to the personal information we hold about you, to request that it be corrected or updated, and to request deletion where we have no lawful basis to retain it.",
      "You may withdraw your consent to remain in the talent pool at any time. Withdrawal does not affect processing already lawfully carried out.",
      `To exercise any of these rights, contact our Information Officer at ${COMPANY.email} or call ${COMPANY.phone}. You also have the right to lodge a complaint with the Information Regulator of South Africa.`,
    ],
  },
];

export default function LegalPage() {
  return (
    <>
      <section className="border-b border-line bg-[#050505]">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <Reveal>
            <SectionLabel>Legal</SectionLabel>
            <h1 className="font-display text-white text-[38px] md:text-[52px] leading-[1.06]">
              Privacy, POPIA &amp; terms
            </h1>
            <p className="text-mist text-[14.5px] leading-relaxed mt-5">
              Plain-language explanations of how we handle your information and what you can expect
              from us.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-14 space-y-12">
        {SECTIONS.map((s) => (
          <Reveal key={s.id}>
            <section id={s.id} className="scroll-mt-28">
              <h2 className="font-display text-white text-[26px] md:text-[30px]">{s.title}</h2>
              <div className="gold-rule my-4" />
              <div className="space-y-4">
                {s.paras.map((p, i) => (
                  <p key={i} className="text-mist text-[13.5px] leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          </Reveal>
        ))}

        <p className="text-mute text-[11.5px] pt-6 border-t border-line">
          Last updated {new Date().getFullYear()}. {COMPANY.legal}. {COMPANY.psira}.
        </p>
      </div>
    </>
  );
}
