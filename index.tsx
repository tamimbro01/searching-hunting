import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { IBuildingBlockProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowUpRight, Bookmark, CalendarDays, Compass, Crosshair, FileText, Lightbulb, MessageCircle, Search, Sparkles, UserRound } from "lucide-react";

type Config = { copies: Record<string, string> };
type SearchInput = { product: string; audience: string; keywords: string };
type Hit = { objectID: string; title?: string | null; story_title?: string | null; author?: string; created_at?: string; comment_text?: string | null; story_text?: string | null; url?: string | null; story_url?: string | null; points?: number | null; num_comments?: number | null };
const plainText = (html: string) => new DOMParser().parseFromString(html, "text/html").body.textContent || "";
const safeExternalUrl = (raw?: string | null) => { try { const u = new URL(raw || ""); return u.protocol === "https:" || u.protocol === "http:" ? u.href : null; } catch { return null; } };

export const BuildingBlock = ({ config }: IBuildingBlockProps<Config>) => {
  const c = config.copies;
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [search, setSearch] = useState<SearchInput | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState("50");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    if (!search) return;
    const request = new AbortController();
    setStatus("loading");
    setHits([]);
    const query = [search.product, search.audience, search.keywords].filter(Boolean).join(" ");
    const params = new URLSearchParams({ query, tags: "(story,comment)", hitsPerPage: pageSize, page: String(page) });
    fetch(`https://hn.algolia.com/api/v1/search?${params}`, { signal: request.signal })
      .then(response => { if (!response.ok) throw new Error("Search failed"); return response.json(); })
      .then((result: { hits?: Hit[]; nbHits?: number; nbPages?: number }) => {
        if (!request.signal.aborted) {
          setHits(Array.isArray(result.hits) ? result.hits : []);
          setTotal(typeof result.nbHits === "number" ? result.nbHits : 0);
          setTotalPages(typeof result.nbPages === "number" ? result.nbPages : 0);
          setStatus("done");
        }
      }).catch(() => { if (!request.signal.aborted) setStatus("error"); });
    return () => request.abort();
  }, [search, page, pageSize]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!product.trim()) { setInvalid(true); return; }
    setInvalid(false);
    setPage(0);
    setSearch({ product: product.trim(), audience: audience.trim(), keywords: keywords.trim() });
  };
  const pagination = <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dce9dd] bg-white px-4 py-3 shadow-[0_4px_18px_rgba(34,71,43,0.03)] sm:px-5">
    <p aria-live="polite" className="text-sm font-semibold text-[#294c38]"><span className="text-[#14764a]">{total.toLocaleString()}</span> {c.matches} <span className="mx-1 text-[#c4d5c6]">·</span> <span className="font-medium text-[#718a78]">{c.page} {page + 1} {c.of} {totalPages}</span></p>
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-[#718a78]">{c.perPage}</span>
      <Select value={pageSize} onValueChange={value => { setPage(0); setPageSize(value); }}>
        <SelectTrigger aria-label={c.perPage} className="h-9 w-[84px] rounded-lg border-[#dce9dd] bg-[#fbfdfb]"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent>
      </Select>
      <Button type="button" variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded-lg border-[#dce9dd] bg-white text-[#315a40] hover:bg-[#eef7ee]">{c.previous}</Button>
      <Button type="button" variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} className="rounded-lg border-[#dce9dd] bg-white text-[#315a40] hover:bg-[#eef7ee]">{c.next}</Button>
    </div>
  </div>;
  return <div className="min-h-screen bg-[#f6f8f5] text-[#1e3029]">
    <div className="flex min-h-screen">
      <aside className="hidden w-[248px] shrink-0 flex-col border-r border-[#e1e9e1] bg-[#fbfcfa] px-5 py-7 lg:flex">
        <div className="flex items-center gap-2.5 px-1"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a6046] text-white"><Crosshair size={19} /></div><span className="text-xl font-bold tracking-tight">{c.brand}<span className="text-[#69aa77]">.</span></span></div>
        <p className="mt-12 px-2 text-[10px] font-bold tracking-[0.18em] text-[#93a49a]">{c.workspace}</p>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#e7f2e8] px-3 py-3 text-sm font-semibold text-[#246b4d]"><Compass size={17}/>{c.nav}</div>
        <div className="mt-auto rounded-2xl bg-[#e9f2e8] p-5"><div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#397b52]"><Sparkles size={17}/></div><h3 className="text-sm font-bold leading-5">{c.sidebarTitle}</h3><p className="mt-2 text-xs leading-5 text-[#71877a]">{c.sidebarBody}</p></div>
        <div className="mt-6 px-2 text-[9px] font-bold tracking-[0.14em] text-[#9daea2]">{c.sidebarFooter}</div>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="flex h-[70px] items-center justify-between border-b border-[#e5ebe4] bg-[#fbfcfa] px-5 sm:px-9 lg:px-12"><div className="flex items-center gap-3 text-sm font-medium text-[#7e9085]"><span className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a6046] text-white"><Crosshair size={16}/></span><span>{c.brand}</span><span className="text-[#c6d2c8]">/</span><span className="text-[#264538]">{c.nav}</span></div><div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-[#6c8c78]"><span className="h-2 w-2 rounded-full bg-[#79ba80]" />{c.topLabel}</div></header>
        <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-9 sm:px-9 lg:px-12 lg:pt-12">
          <div className="mb-8 max-w-3xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#dcecdf] bg-[#eff8ef] px-3 py-1.5 text-[10px] font-bold tracking-[0.13em] text-[#44875c]"><Sparkles size={12}/>{c.badge}</div><h1 className="max-w-[760px] text-3xl font-semibold leading-[1.13] tracking-[-0.04em] text-[#1c3528] sm:text-[42px]">{c.title}</h1><p className="mt-4 max-w-[660px] text-sm leading-6 text-[#788b7e] sm:text-[15px]">{c.subtitle}</p></div>
          <section className="rounded-2xl border border-[#e2eae1] bg-white p-5 shadow-[0_8px_30px_rgba(34,71,43,0.04)] sm:p-7"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf5e9] text-[#438b5a]"><Search size={19}/></div><div><h2 className="text-lg font-semibold tracking-tight">{c.formTitle}</h2><p className="mt-1 text-xs text-[#8a9b8e]">{c.formHint}</p></div></div>
            <form onSubmit={submit} className="mt-6"><div className="grid gap-4 md:grid-cols-3"><div><Label htmlFor="product" className="mb-2 block text-xs font-semibold text-[#4d6656]">{c.product} <span className="text-[#d47568]">*</span></Label><Input id="product" value={product} onChange={e=>{setProduct(e.target.value);setInvalid(false);}} placeholder={c.productPlaceholder} aria-invalid={invalid} className="h-11 border-[#e1e9df] bg-[#fbfcfa] text-sm placeholder:text-[#a8b5ab]"/>{invalid && <p role="alert" className="mt-2 text-xs text-red-600">{c.required}</p>}</div><div><Label htmlFor="audience" className="mb-2 block text-xs font-semibold text-[#4d6656]">{c.audience} <span className="font-normal text-[#a2b1a5]">· {c.optional}</span></Label><Input id="audience" value={audience} onChange={e=>setAudience(e.target.value)} placeholder={c.audiencePlaceholder} className="h-11 border-[#e1e9df] bg-[#fbfcfa] text-sm placeholder:text-[#a8b5ab]"/></div><div><Label htmlFor="keywords" className="mb-2 block text-xs font-semibold text-[#4d6656]">{c.keywords} <span className="font-normal text-[#a2b1a5]">· {c.optional}</span></Label><Input id="keywords" value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder={c.keywordsPlaceholder} className="h-11 border-[#e1e9df] bg-[#fbfcfa] text-sm placeholder:text-[#a8b5ab]"/></div></div><div className="mt-5 flex flex-col justify-between gap-4 border-t border-[#edf1eb] pt-5 xl:flex-row xl:items-center"><div className="flex flex-wrap items-center gap-2"><span className="mr-1 text-[9px] font-bold tracking-[0.14em] text-[#a0afa3]">{c.examples}</span>{[c.exampleOne,c.exampleTwo,c.exampleThree].map(example=><Button key={example} type="button" variant="outline" onClick={()=>{setProduct(example);setInvalid(false);}} className="h-7 rounded-full border-[#e6ece4] px-3 text-[10px] font-medium text-[#738779] hover:bg-[#eff7ee]">{example}</Button>)}</div><Button type="submit" className="h-11 rounded-xl bg-[#1b694a] px-6 text-sm font-semibold text-white hover:bg-[#15563c]">{c.search}<ArrowRight size={16}/></Button></div></form>
          </section>
          {!search ? <section className="mt-8 flex min-h-[235px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d7e5d6] bg-[#f9fbf8] px-6 text-center"><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9f4e8] text-[#6aaa77]"><Crosshair size={26}/></div><h2 className="text-base font-semibold text-[#344c3b]">{c.emptyTitle}</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#91a195]">{c.emptyBody}</p></section> : <section className="mt-10"><div className="mb-5"><p className="text-[10px] font-bold tracking-[0.15em] text-[#77a385]">{c.resultsEyebrow}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">{c.resultsTitle}</h2><p className="mt-1.5 text-sm leading-6 text-[#849689]">{c.resultsBody}</p><p className="mt-2 text-sm font-semibold text-[#47735a]">{c.searchingFor}: {search.product}</p></div>
            <div className="mb-5 flex gap-3 rounded-xl border border-[#e1ebe0] bg-[#f0f7ee] p-4"><Lightbulb className="mt-0.5 shrink-0 text-[#6d9d71]" size={18}/><p className="text-xs leading-5 text-[#58735f]">{c.sourceNotice}</p></div>
            {status === "loading" && <div role="status" className="rounded-2xl border border-[#e0ebe0] bg-white p-6 text-sm text-[#547460]"><div className="flex items-center gap-3"><span className="h-4 w-4 rounded-full border-2 border-[#c6e4cd] border-t-[#2c8051] motion-safe:animate-spin" />{c.loading}</div><div aria-hidden="true" className="mt-5 grid gap-4 md:grid-cols-2">{[1, 2].map(i => <div key={i} className="space-y-3 rounded-xl border border-[#edf2ed] p-4 motion-safe:animate-pulse"><div className="h-4 w-20 rounded-full bg-[#eaf2e9]"/><div className="h-4 w-4/5 rounded-full bg-[#eef3ee]"/><div className="h-3 w-1/2 rounded-full bg-[#f1f5f1]"/></div>)}</div></div>}
            {status === "error" && <p role="alert" className="rounded-xl border border-red-200 bg-white p-6 text-sm text-red-700">{c.searchError}</p>}
            {status === "done" && hits.length === 0 && <p className="rounded-xl bg-white p-6 text-sm text-[#738779]">{c.noResults}</p>}
            {status === "done" && hits.length > 0 && <><div className="mb-4">{pagination}{total > totalPages * Number(pageSize) && <p className="mt-2 text-sm text-[#738779]">{c.resultLimit}</p>}</div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{hits.map((hit, index) => {
              const articleUrl = safeExternalUrl(hit.url || hit.story_url);
              // The search API does not provide page previews; show only directly linked images.
              const imageUrl = articleUrl && /^https:\/\//i.test(articleUrl) && /\.(?:jpe?g|png|gif|webp|avif)(?:[?#]|$)/i.test(articleUrl) ? articleUrl : undefined;
              const text = plainText(hit.comment_text || hit.story_text || "").trim();
              const itemUrl = /^\d+$/.test(hit.objectID) ? `https://news.ycombinator.com/item?id=${hit.objectID}` : null;
              const isComment = Boolean(hit.comment_text);
              return <article key={hit.objectID} className="group relative flex h-[300px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e3ebe2] bg-white p-4 shadow-[0_4px_18px_rgba(32,68,42,0.04)] transition-colors motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_16px_35px_rgba(32,68,42,0.10)] hover:border-[#c8dfca]">
                <div aria-hidden="true" className={isComment ? "absolute inset-y-0 left-0 w-1 bg-violet-300" : "absolute inset-y-0 left-0 w-1 bg-amber-300"}/>
                <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className={isComment ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600" : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600"}>{isComment ? <MessageCircle size={18}/> : <FileText size={18}/>}</span><div><span className={isComment ? "text-[11px] font-bold uppercase tracking-[0.1em] text-violet-700" : "text-[11px] font-bold uppercase tracking-[0.1em] text-orange-700"}>{isComment ? c.commentLabel : c.postLabel}</span><p className="mt-0.5 text-xs font-medium text-[#9aa99b]">Hacker News</p></div></div><span className="rounded-full bg-[#f5f8f4] px-2.5 py-1 text-[10px] font-semibold tabular-nums text-[#99a99b]">#{page * Number(pageSize) + index + 1}</span></div>
                <div className="mt-4 flex min-w-0 items-start gap-3"><h3 className="line-clamp-2 min-w-0 flex-1 break-words text-[15px] font-semibold leading-snug tracking-[-0.02em] text-[#203b2b]">{hit.title || hit.story_title || c.untitled}</h3>{imageUrl && <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#e3ebe2] bg-[#f7faf6]"><img src={imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain" onError={(event) => { const wrapper = event.currentTarget.parentElement; if (wrapper) wrapper.style.display = "none"; }}/></span>}</div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#819487]"><span className="inline-flex min-w-0 items-center gap-1.5"><UserRound size={13} className="shrink-0"/><span className="max-w-[110px] truncate">{hit.author ? `@${hit.author}` : c.unknownAuthor}</span></span>{hit.created_at && <span className="inline-flex items-center gap-1.5"><CalendarDays size={13}/>{hit.created_at.slice(0,10)}</span>}</div>
                {text && <div className="mt-3 rounded-lg bg-[#f7faf6] p-3"><p className="line-clamp-2 break-words text-sm leading-5 text-[#607669]">{text}</p></div>}
                <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-[#eef3ed] pt-3">{itemUrl && <a href={itemUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#eaf5eb] px-3 py-2 text-xs font-semibold text-[#246e46] transition-colors hover:bg-[#d9eddd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#246e46]">{c.viewPost}<ArrowUpRight size={14}/></a>}{articleUrl && <a href={articleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#e3ebe2] px-3 py-2 text-xs font-semibold text-[#52745b] transition-colors hover:bg-[#f5faf5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#246e46]">{c.viewArticle}<ArrowUpRight size={14}/></a>}</div>
              </article>;
            })}</div><div className="mt-4">{pagination}</div></>}
          </section>}
          <div className="mt-8 flex items-center gap-2 text-xs text-[#a4b2a6]"><Bookmark size={13}/><span>{c.sidebarFooter}</span></div>
        </div>
      </main>
    </div>
  </div>;
};
