'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  WhatsappShareButton, TwitterShareButton, FacebookShareButton,
  WhatsappIcon, TwitterIcon, FacebookIcon,
} from 'react-share'
import { POOJA_GUIDES, DIFFICULTY_COLORS, type PoojaGuide } from '@/lib/poojaGuides'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function SectionHeading({ id, icon, title }: { id: string; icon: string; title: string }) {
  return (
    <h2 id={id} className="font-heading text-2xl flex items-center gap-2 mb-5 scroll-mt-24">
      <span>{icon}</span> {title}
    </h2>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GuideDetail({ guide }: { guide: PoojaGuide }) {
  const [copiedMantra, setCopiedMantra] = useState<string | null>(null)

  const shareUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://poojabook.vercel.app/guide/${guide.slug}`
  const shareTitle = `${guide.name} — Complete Guide | PoojaBook`

  const copyMantra = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedMantra(text)
    setTimeout(() => setCopiedMantra(null), 2000)
  }

  const essential   = guide.samagri.filter(s => s.essential)
  const optional    = guide.samagri.filter(s => !s.essential)
  const relatedFull = guide.relatedPoojas
    .map(slug => POOJA_GUIDES.find(g => g.slug === slug))
    .filter(Boolean) as PoojaGuide[]

  const bookingUrl = guide.bookingCTA?.url || `/poojas?search=${encodeURIComponent(guide.name)}`

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-secondary to-secondary/90 text-white">
        <div className="container mx-auto px-4 py-14">
          <Link href="/guide" className="text-orange-200 hover:text-white text-sm mb-4 inline-flex items-center gap-1 transition">
            ← Back to Pooja Guide
          </Link>
          <div className="flex flex-col md:flex-row md:items-center gap-6 mt-4">
            <span className="text-8xl">{guide.icon}</span>
            <div>
              <p className="text-orange-300 text-sm font-semibold uppercase tracking-wider mb-1">
                {guide.category}
              </p>
              <h1 className="font-heading text-4xl md:text-5xl mb-2">{guide.name}</h1>
              <p className="text-gray-300 text-lg mb-4">{guide.shortDesc}</p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white/10 px-3 py-1.5 rounded-full text-sm">⏱ {guide.duration}</span>
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${DIFFICULTY_COLORS[guide.difficulty]}`}>
                  {guide.difficulty}
                </span>
                <span className="bg-white/10 px-3 py-1.5 rounded-full text-sm">📍 {guide.region}</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-full text-sm">🙏 {guide.deity}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3 flex-wrap">
            <Link
              href={bookingUrl}
              className="px-6 py-3 bg-accent text-secondary font-semibold rounded-full hover:bg-accent/90 transition text-sm"
            >
              📅 {guide.bookingCTA?.text || `Book ${guide.name}`}
            </Link>
            <a
              href="#samagri"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition text-sm font-medium"
            >
              🛒 View Samagri List
            </a>
          </div>
        </div>
      </div>

      {/* ── BODY: sticky TOC + content ───────────────────────────────────── */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex gap-8 items-start">

          {/* Sticky Table of Contents */}
          <aside className="hidden xl:block w-52 flex-shrink-0 sticky top-24">
            <div className="bg-surface rounded-2xl border p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">On This Page</p>
              <ul className="space-y-2 text-sm">
                {[
                  guide.whatIsThis && { id: 'about',    label: '📖 About' },
                  guide.whenToPerform && { id: 'when',  label: '🗓️ When to Perform' },
                  { id: 'samagri',  label: '🛒 Samagri' },
                  guide.process && { id: 'process', label: '📋 Process' },
                  { id: 'benefits', label: '✨ Benefits' },
                  guide.mantras && { id: 'mantras',  label: '🕉️ Mantras' },
                  { id: 'book',     label: '🪔 Book Now' },
                ].filter((item): item is { id: string; label: string } => Boolean(item)).map((item) => {
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-text-secondary hover:text-primary transition"
                      >
                        {item.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-12">

            {/* ── ABOUT ──────────────────────────────────────────────────── */}
            {guide.whatIsThis && (
              <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <SectionHeading id="about" icon="📖" title={`What is ${guide.name}?`} />
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                    <p className="text-gray-700 font-medium">{guide.whatIsThis.summary}</p>
                  </div>
                  <p className="text-text-secondary leading-relaxed">{guide.whatIsThis.details}</p>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Significance</p>
                    <p className="text-amber-800">{guide.whatIsThis.significance}</p>
                  </div>
                </div>
              </motion.section>
            )}

            {/* ── WHEN TO PERFORM ────────────────────────────────────────── */}
            {(guide.whenToPerform || guide.bestTime) && (
              <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <SectionHeading id="when" icon="🗓️" title="When to Perform?" />
                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">⏰ Best Time</p>
                    <p className="font-semibold text-blue-800">{guide.bestTime.time}</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">📅 Best Days</p>
                    <p className="font-semibold text-purple-800">{guide.bestTime.days.join(' · ')}</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
                    <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">🌙 Best Tithis</p>
                    <p className="font-semibold text-yellow-800">{guide.bestTime.tithis.join(' · ')}</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">🌟 Occasions</p>
                    <p className="font-semibold text-green-800 text-sm">{guide.bestTime.occasions.join(', ')}</p>
                  </div>
                </div>
                {guide.whenToPerform && (
                  <ul className="space-y-2">
                    {guide.whenToPerform.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.section>
            )}

            {/* ── SAMAGRI ────────────────────────────────────────────────── */}
            <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <SectionHeading id="samagri" icon="🛒" title="Required Samagri (Materials)" />
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Essential */}
                <div>
                  <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Essential Items
                  </h3>
                  <div className="space-y-2">
                    {essential.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                        <span className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-green-500">✅</span> {item.item}
                        </span>
                        <span className="text-xs text-gray-500 font-medium flex-shrink-0 ml-2">× {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Optional */}
                {optional.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" /> Optional Items
                    </h3>
                    <div className="space-y-2">
                      {optional.map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                          <span className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="text-gray-300">◻</span> {item.item}
                          </span>
                          <span className="text-xs text-gray-400 font-medium flex-shrink-0 ml-2">× {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between gap-4">
                <p className="text-sm text-orange-700">
                  💡 <strong>Tip:</strong> Order a ready-made samagri kit online to save time. All items are pre-measured and ready to use.
                </p>
                <a
                  href={`https://www.amazon.in/s?k=${encodeURIComponent(guide.name + ' samagri kit')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition"
                >
                  🛒 Order Kit
                </a>
              </div>
            </motion.section>

            {/* ── PROCESS ────────────────────────────────────────────────── */}
            {guide.process && guide.process.length > 0 && (
              <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <SectionHeading id="process" icon="📋" title="Step-by-Step Process" />
                <div className="mb-4 inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm px-4 py-2 rounded-full border border-amber-200">
                  ⏱ Total Duration: <strong>{guide.duration}</strong>
                </div>
                <div className="space-y-4">
                  {guide.process.map((step, i) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                          {step.step}
                        </div>
                        {i < guide.process!.length - 1 && (
                          <div className="w-0.5 h-full bg-primary/20 mt-1" />
                        )}
                      </div>
                      <div className="pb-6 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-800">{step.title}</h3>
                          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">{step.duration}</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ── BENEFITS ───────────────────────────────────────────────── */}
            <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <SectionHeading id="benefits" icon="✨" title="Benefits & Significance" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {guide.benefits.map((b, i) => (
                  <div key={i} className="bg-surface border rounded-2xl p-5 hover:shadow-md transition">
                    <div className="text-3xl mb-2">{b.icon}</div>
                    <h3 className="font-semibold text-gray-800 mb-1">{b.benefit}</h3>
                    <p className="text-sm text-text-secondary">{b.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ── MANTRAS ────────────────────────────────────────────────── */}
            {guide.mantras && guide.mantras.length > 0 && (
              <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <SectionHeading id="mantras" icon="🕉️" title="Key Mantras" />
                <div className="space-y-4">
                  {guide.mantras.map((mantra, i) => (
                    <div key={i} className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-purple-800">{mantra.name}</h3>
                          <p className="text-xs text-purple-500">
                            Repeat: {mantra.repetitions.toLocaleString()}×
                          </p>
                        </div>
                        <button
                          onClick={() => copyMantra(mantra.text)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition"
                        >
                          {copiedMantra === mantra.text ? '✓ Copied!' : '📋 Copy'}
                        </button>
                      </div>
                      <pre className="font-serif text-purple-900 text-sm leading-relaxed whitespace-pre-wrap bg-white/60 rounded-xl p-4 border border-purple-100">
                        {mantra.text}
                      </pre>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ── BOOK CTA BANNER ────────────────────────────────────────── */}
            <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} id="book">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white text-center">
                <p className="text-3xl mb-2">🪔</p>
                <h2 className="font-heading text-2xl mb-2">Ready to perform {guide.name}?</h2>
                <p className="text-orange-100 mb-6 max-w-md mx-auto">
                  Book an experienced pandit and experience a perfect, authentic ceremony guided by tradition.
                </p>
                <Link
                  href={bookingUrl}
                  className="inline-block px-8 py-3 bg-white text-orange-600 font-bold rounded-full hover:bg-orange-50 transition text-sm"
                >
                  📅 {guide.bookingCTA?.text || `Book ${guide.name} Now`} →
                </Link>
              </div>
            </motion.section>

            {/* ── SHARE ──────────────────────────────────────────────────── */}
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-sm font-medium text-gray-600">Share this guide:</p>
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <WhatsappIcon size={36} round />
              </WhatsappShareButton>
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <TwitterIcon size={36} round />
              </TwitterShareButton>
              <FacebookShareButton url={shareUrl}>
                <FacebookIcon size={36} round />
              </FacebookShareButton>
            </div>

            {/* ── RELATED POOJAS ─────────────────────────────────────────── */}
            {relatedFull.length > 0 && (
              <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <SectionHeading id="related" icon="🔗" title="Related Poojas" />
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedFull.map(r => (
                    <Link
                      key={r.id}
                      href={`/guide/${r.slug}`}
                      className="group flex items-center gap-3 bg-surface border rounded-2xl p-4 hover:border-primary hover:shadow-md transition"
                    >
                      <span className="text-4xl">{r.icon}</span>
                      <div>
                        <p className="font-semibold group-hover:text-primary transition text-sm">{r.name}</p>
                        <p className="text-xs text-text-secondary">{r.deity}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
