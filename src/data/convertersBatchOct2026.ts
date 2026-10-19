// Batch: 5 SEO converter articles (2026-10-13). Imported and spread into
// CONVERTERS_LIST in convertersData.ts (keeps the converters diff small).
import type { ConverterInfo } from '../types';

export const CONVERTERS_BATCH_OCT2026: ConverterInfo[] = [
{
  id: 'webp-to-jpg',
  fromExt: 'WEBP',
  toExt: 'JPG',
  name: 'WebP to JPG Converter',
  category: 'Images',
  description:
    'WebP to JPG free: why Chrome saves images as WebP, and how to convert them on Windows, Mac, or right in your browser — no upload required.',
  steps: [
    {
      title: 'First, understand why you keep getting WebP files',
      desc: 'Nothing is broken — Chrome is saving exactly what the website sent it. Modern sites serve images in WebP because the format is roughly 25–35% smaller than JPEG at similar visual quality, which makes pages load faster and cuts the site\'s bandwidth bill. When your browser requests an image, it advertises the formats it can display, the server picks WebP, and Chrome downloads the WebP. Right-clicking "Save image as" then saves that WebP file. There was never a JPG on your end to begin with — the original on the server may well have been a JPG, but what traveled over the network was the WebP version. This is why the behavior feels random: sites that still serve classic JPEGs save as .jpg normally, while sites on modern image pipelines hand you .webp every time. Knowing this matters because it tells you the fix is conversion, not a Chrome setting — there is no toggle that makes Chrome "save the original," since Chrome never received the original. If you want background detail on the format itself, our [WebP guide](https://anyfilex.com/file-extensions/webp) covers what WebP is and where it shines, and the [JPG guide](https://anyfilex.com/file-extensions/jpg) explains why JPEG remains the universal fallback. One technical detail that explains the whole phenomenon: when your browser requests an image, it sends an Accept header listing the formats it can display — typically something like image/avif,image/webp,image/* — and the server uses that list to decide what to send. This is called content negotiation, and it happens before any bytes travel. The server is not hiding a JPG from you; it genuinely chose WebP as the best answer to your browser\'s request. Extensions that claim to \'save the original JPG\' cannot recover bytes the server never sent — they either convert the WebP after download or re-request with a modified Accept header, which only works if the server actually has another version to give.',
    },
    {
      title: 'Fastest fix: convert in your browser with no upload',
      desc: 'For the common case — one or a handful of images you just saved — an in-browser converter is the shortest path. Open the [WebP to JPG tool](https://anyfilex.com/converters/webp-to-jpg), drop your .webp files in, and download the JPGs. Because the conversion runs entirely on your device, nothing is uploaded to any server, which is worth caring about: downloaded images often include personal photos, screenshots with visible information, or client work. Traditional online converters require uploading the file to a stranger\'s server first. The in-browser approach also tends to be faster for small batches since there is no upload/download round trip — the only transfer is the finished JPG coming back to you. One honest limitation: converting WebP to JPG is a lossy step. JPG cannot do everything WebP does (more on transparency below), so keep the original .webp files if you might need them again. Working through a whole folder? Drop all the files in at once instead of converting one by one — batch conversion is where the in-browser approach really pulls ahead of desktop apps, since there is no per-file dialog dance.',
    },
    {
      title: 'Windows: Paint, Photos, or IrfanView',
      desc: 'On Windows 11, the built-in Paint app opens WebP images — open the file in Paint, then choose File > Save as > JPEG picture. It is quick for one-off conversions and needs no install. If you have the free "WebP Image Extensions" from the Microsoft Store, the Photos app opens WebP too, though Photos is less convenient for format conversion. For batch work on Windows, IrfanView is the long-standing free choice: open a WebP, press B for batch conversion, add your files, set the output format to JPG, and let it run through dozens of images in seconds. IrfanView also exposes the JPEG quality setting, so you can decide the size-versus-quality tradeoff yourself instead of accepting a converter\'s default. Whatever Windows route you take, remember that the JPG will not preserve transparency — a transparent WebP becomes a JPG with a solid background, usually white.',
    },
    {
      title: 'Mac: Preview export',
      desc: 'Recent versions of macOS open WebP files directly in Preview, which makes conversion a two-click job: double-click the .webp to open it in Preview, then choose File > Export, pick JPEG from the Format dropdown, adjust the quality slider to taste, and save. The quality slider is the whole game here — dragging it right gives you a larger file closer to the original; dragging it left shrinks the file at the cost of visible artifacts. For most purposes (email attachments, uploads, documents) a middle-to-high setting is the sweet spot. If your macOS version predates WebP support in Preview, skip straight to the in-browser tool above rather than fighting the OS — installing codec packs for one conversion is never worth it. Bonus tip for repeat offenders: macOS lets you build a Quick Action in Automator that converts images to JPEG straight from the right-click menu, so frequent converters can skip opening Preview entirely.',
    },
    {
      title: 'Batch convert from the command line with dwebp',
      desc: 'If you have tens or hundreds of WebP files, the command line beats clicking. Google\'s libwebp package includes dwebp, a tiny decoder: `dwebp input.webp -o output.jpg` converts one file, and a shell loop handles a folder — `for f in *.webp; do dwebp "$f" -o "${f%.webp}.jpg"; done`. Install libwebp through your package manager (it is in most Linux repositories, Homebrew on Mac, and available as a Windows binary from Google\'s WebP page). The advantage over GUI tools is scripting: you can fold the conversion into a larger workflow, run it on a server, or process nested folders with one command. The honest tradeoff is that dwebp gives you no quality slider theatrics — it decodes the WebP faithfully and encodes a straightforward JPG, which is exactly what you want for bulk jobs. The sibling tools in the package cover the reverse direction too: cwebp encodes JPGs or PNGs into WebP when you want the smaller format for your own site.',
    },
    {
      title: 'Get the JPG at the source (fewer conversions later)',
      desc: 'If you save images from the web constantly, preventing the WebP detour beats converting every time. The free "Save image as Type" extension for Chrome adds a right-click option to save the image as PNG, JPG, or WebP directly, skipping the post-download conversion for many sites. A lighter trick that often works: right-click the image and choose "Open image in new tab," then look at the URL — if it ends in something like `.jpg.webp` or has a format parameter, editing it back to `.jpg` sometimes loads the original. Neither trick works everywhere, because some sites only have the WebP version to give you. For those cases, the conversion methods above are the reliable fallback — and honestly, for occasional downloads, converting after the fact is less fuss than maintaining extensions.',
    },
    {
      title: 'When the converted JPG still gets rejected',
      desc: 'Every so often the fresh JPG still bounces off an upload form or looks wrong somewhere, and the cause is rarely the format itself at that point. First suspect: dimensions. Some forms cap images at a few megabytes or a few thousand pixels wide — a straight WebP-to-JPG conversion preserves the original dimensions, so a huge source makes a huge JPG. Shrink it during conversion if the tool offers resizing, or open the result in Paint or Preview and scale it down. Second suspect: color profiles. WebP files can carry ICC profiles that do not survive conversion cleanly, leaving the JPG looking washed out or oversaturated in some viewers; converting with color management left at defaults usually avoids this, and if one specific image looks off, try a different converter. Third: the site wanted a different format all along. A few uploaders accept PNG but not JPG, or demand files under a size your high-quality JPG exceeds — re-export at a lower quality setting rather than converting formats again. And if an uploader rejects the file with a cryptic error right after conversion, re-download the original WebP and convert once more with a different tool before assuming the worst; a surprising number of "corrupt file" errors are just one bad encode.',
    },
  ],
  recommendedApps: [
    'AnyFileX WebP to JPG tool (in-browser)',
    'Paint (Windows 11)',
    'Preview (macOS)',
    'IrfanView',
    'dwebp (libwebp)',
    'Save image as Type (Chrome extension)',
  ],
  commonIssues: [
    'Transparency disappears: JPG has no alpha channel, so transparent areas of a WebP become a solid background (usually white) in the JPG. If you need transparency, convert to [PNG](https://anyfilex.com/file-extensions/png) instead.',
    'Animation is lost: animated WebP files convert to a single still JPG — the first frame. There is no way to keep animation in a JPG; use GIF or video for that.',
    'Quality can only go down, never up: converting decodes the WebP and re-encodes as JPG, both lossy steps. The result is fine for sharing, but do not convert back and forth repeatedly.',
    'The JPG is often larger than the WebP was — expected, since WebP compresses better. If file size matters more than compatibility, consider keeping the WebP.',
    'Chrome still saves as WebP after you "fixed" it: some sites serve only WebP, so no setting or extension can conjure a JPG that was never sent. Convert those files instead.',
    'The converted JPG looks washed out or blocky: the converter used a low quality setting. Re-convert with quality set high (or use a tool that lets you choose).',
    'Upload sites reject the file anyway: a few platforms validate more than the extension. If a fresh JPG still fails, the issue is dimensions or file size limits, not the format.',
  ],
  faqs: [
    {
      question: 'Does converting WebP to JPG lose quality?',
      answer:
        'Slightly, yes — both formats are lossy, so decoding the WebP and re-encoding as JPG discards a little detail each time. In practice, a one-time conversion at a high quality setting is visually indistinguishable from the original for photos and web graphics. The real quality trap is converting back and forth repeatedly, or starting from an already low-quality WebP. If you need the best possible result, convert from the highest-quality source you have — a WebP saved at high quality converts to a cleaner JPG than a heavily compressed one, and no converter can recover detail the WebP already discarded.',
    },
    {
      question: 'Why does Chrome save images as WebP instead of JPG?',
      answer:
        'Because the website served a WebP. Chrome advertises the image formats it supports, the server chooses WebP for its smaller file size, and "Save image as" downloads exactly what was received. It is not a Chrome bug or a setting you flipped — the JPG version may never have reached your computer at all.',
    },
    {
      question: 'Can I make Chrome save JPG by default?',
      answer:
        'Not with a built-in setting — Chrome saves whatever format the server sends. The practical workarounds are a "Save image as Type" style extension that requests a different format, or simply converting the WebP after download, which takes seconds with an in-browser tool.',
    },
    {
      question: 'What happens to transparency when converting WebP to JPG?',
      answer:
        'It is replaced with a solid background, almost always white, because the JPG format cannot represent transparency. If the transparent areas matter — a logo, an icon, an overlay graphic — convert to PNG instead of JPG to preserve the alpha channel.',
    },
    {
      question: 'Is WebP better than JPG? Should I even convert?',
      answer:
        'Technically yes for web use: WebP files are notably smaller at similar quality and support transparency and animation. Convert only when compatibility demands it — email attachments, messaging apps, print shops, older software, and upload forms that reject .webp. If nothing requires JPG, keeping the WebP is the better file. One caveat for archivists: JPG\'s universality is its own kind of future-proofing. Thirty years from now, a JPG will still open everywhere; WebP will probably be fine too, but if you are storing images you must be able to open in a decade, the boring universal format is the safer bet.',
    },
  ],
  isInteractiveToolAvailable: true,
  onlineConversionSupported: true,
  speedRating: 'Fast (< 30s)',
  qualityRating: 'Near Lossless',
},
{
  id: 'mov-to-mp4',
  fromExt: 'MOV',
  toExt: 'MP4',
  name: 'MOV to MP4 Converter',
  category: 'Video',
  description:
    'Convert MOV to MP4 free: remux in seconds without quality loss when possible, re-encode when needed. FFmpeg, VLC, HandBrake, and browser methods.',
  steps: [
    {
      title: 'Understand the choice first: remux vs re-encode',
      desc: 'This is the distinction almost no converter explains, and it decides everything about speed and quality. MOV and MP4 are containers — wrappers that hold video and audio streams — not codecs. If your MOV already contains streams that MP4 accepts (very commonly H.264 video with AAC audio, which is what iPhones and most cameras record), you can remux: copy the streams untouched into a new MP4 container. Remuxing takes seconds even for large files and loses zero quality, because the actual video data is never decoded and re-encoded. If the MOV holds something MP4 cannot carry (Apple ProRes, DNxHD, or other editing codecs), remuxing fails and you must re-encode: decode the video fully and compress it again as H.264, which takes much longer and costs a little quality. Rule of thumb: phone and camera footage almost always remuxes; exports from editing software often need re-encoding. Other containers you may meet include [MKV](https://anyfilex.com/file-extensions/mkv) — which accepts almost any codec — and the legacy [AVI](https://anyfilex.com/file-extensions/avi) format that older Windows software still expects. Our [MOV guide](https://anyfilex.com/file-extensions/mov) and [MP4 guide](https://anyfilex.com/file-extensions/mp4) cover what each container is good at, if you want the background. It helps to know that MOV and MP4 are close relatives, not strangers: both are built on the ISO base media file format (MPEG-4 Part 12). Apple\'s QuickTime MOV container came first, and the MP4 standard was derived from it, which is why the two share so much internal structure. That shared DNA is exactly why remuxing usually works — the audio and video streams often need no re-encoding at all, just a new container around them. It is also why simply renaming a .mov file to .mp4 sometimes plays fine and sometimes fails outright: some players look past the extension and read the container, while others trust the extension and refuse. Renaming is a gamble; a proper remux takes seconds and removes the doubt. One caveat for very old .mov files: a container from the early 2000s can hold legacy video codecs that modern players no longer ship decoders for. If your converted MP4 plays video but stays silent — or refuses to play at all — the culprit is usually the codec inside, not the container swap. In that case the fix is a full re-encode to H.264/AAC rather than a remux, which is exactly what step 3 below covers.',
    },
    {
      title: 'Method 1 — Remux with FFmpeg (fastest, zero quality loss)',
      desc: 'When remuxing works, nothing beats it. Install FFmpeg (free, from ffmpeg.org, available for Windows, Mac, and Linux), open a terminal in the folder with your file, and run: `ffmpeg -i input.mov -c copy output.mp4`. The `-c copy` flag tells FFmpeg to copy every stream without touching it — a two-minute 4K clip converts in a few seconds. Add `-movflags +faststart` to move the MP4\'s metadata to the front of the file, which lets the video start playing before it finishes downloading — worth doing for anything headed to the web: `ffmpeg -i input.mov -c copy -movflags +faststart output.mp4`. How do you know remuxing worked? FFmpeg will either complete silently (success) or complain about an incompatible codec (then use Method 2). Always write to a new filename — never overwrite your source file until you have verified the output plays correctly with sound.',
    },
    {
      title: 'Method 2 — Re-encode with FFmpeg (when remuxing fails)',
      desc: 'If FFmpeg reports that a stream cannot go into MP4, re-encode it: `ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -c:a aac output.mp4`. Here is what the flags mean. `-c:v libx264` selects the H.264 encoder — the most universally compatible video codec on earth. `-crf 23` sets quality: CRF is a 0–51 scale where lower means better, 23 is the default, and 18–28 is the useful range (use 18–20 for archival quality, up to 28 for small shareable files). `-preset medium` trades encoding speed against file size — slower presets like `slow` squeeze smaller files from the same quality; `fast` finishes sooner. `-c:a aac` converts the audio to AAC, the standard MP4 audio codec. Expect this to take a while: re-encoding is CPU-heavy, roughly real-time to several-times-real-time depending on your machine. A useful middle ground when only the audio is incompatible: `-c:v copy -c:a aac` copies the video untouched and re-encodes just the audio — fast and lossless where it counts.',
    },
    {
      title: 'Method 3 — VLC, no command line required',
      desc: 'If the terminal is not your thing, VLC (free, from videolan.org) converts through its interface: Media > Convert / Save, add your MOV, click Convert, and choose the "Video - H.264 + MP3 (MP4)" profile from the dropdown, then set a destination filename ending in .mp4 and start. VLC re-encodes rather than remuxing, so it handles any input codec — including the ProRes files that defeat `-c copy` — at the cost of conversion time. The default profile\'s settings are sensible for general sharing; if the output looks soft, raise the quality in the profile\'s video codec settings before converting. VLC is also a good sanity checker: if VLC itself cannot play the MOV, the file may be corrupted rather than merely in the wrong container, and no converter will fix that. One useful tweak: in the Convert dialog, click the wrench icon next to the profile to raise the video bitrate if the default output looks soft — small bitrate bumps cost little in file size and visibly help detailed footage.',
    },
    {
      title: 'Method 4 — HandBrake for a visual workflow',
      desc: 'HandBrake (free, open source) is the friendliest serious option: drop in the MOV, pick an MP4 preset like "Fast 1080p30," and start the encode. Its presets encode years of accumulated wisdom about bitrate, H.264 settings, and audio handling, so beginners get good results without learning what CRF means. Two settings deserve your attention. First, make sure the output container is MP4, not MKV (HandBrake defaults vary by preset). Second, the quality slider works like FFmpeg\'s CRF in reverse — lower numbers mean higher quality. HandBrake always re-encodes, so it will not match remuxing for speed, but for files that need re-encoding anyway, its preview window lets you check the result before committing to a long encode. Like VLC, it runs on Windows, Mac, and Linux. For batches, use HandBrake\'s queue: add all your MOVs, pick the preset once, and let it chew through them unattended — far nicer than babysitting one conversion at a time.',
    },
    {
      title: 'Method 5 — In-browser tools for small files',
      desc: 'Browser-based converters work for short clips, with two honest caveats. First, video files are big: uploading a multi-gigabyte MOV to a converter site takes longer than the conversion itself, and many free tiers cap file size. Second, privacy: that footage travels to someone else\'s server. For a 50MB screen recording, an online converter is perfectly reasonable; for client footage, family videos, or anything sensitive, prefer the local methods above — FFmpeg, VLC, and HandBrake all run entirely on your machine. If you do use an online tool, check whether it remuxes or re-encodes (most re-encode silently) and download the result promptly, since free services often delete files after a short window. As a rule of thumb, if uploading the file would take longer than a local FFmpeg remux — which is measured in seconds — the browser route is not actually saving you any time.',
    },
    {
      title: 'Verify the output before you delete the original',
      desc: 'However you converted, spend sixty seconds checking the result before the source MOV gets deleted or archived. Play the MP4 end to end — or at least scrub through it — with the sound on: the most common silent failure is a missing or out-of-sync audio track, which you will only catch by listening. Check the duration against the original; a shorter runtime means the conversion cut content, usually because of a damaged source or a misread frame rate. Test seeking: jump to the middle of the timeline and confirm it starts promptly rather than hanging, which catches broken indexes. If the file is headed to the web, confirm faststart is in effect — a quick way is to start playing it from a server or shared link before the download completes. Finally, open it on the actual target device if you can: the phone, TV, or editing app it was converted for. Codecs that play fine in VLC can still choke picky hardware players, and discovering that after you deleted the MOV is a bad day. Keep originals until the MP4 has proven itself where it will actually be used.',
    },
  ],
  recommendedApps: [
    'FFmpeg (remux + re-encode)',
    'VLC media player',
    'HandBrake',
    'AnyFileX in-browser converters',
  ],
  commonIssues: [
    'Renaming .mov to .mp4 does not convert anything — the container and codecs are unchanged, and most players will still refuse it or misbehave. Convert properly with one of the methods above.',
    'Remuxing fails with a codec error: your MOV uses a codec MP4 cannot hold (often ProRes from editing software). Re-encode with Method 2 instead of fighting it.',
    'No audio in the output: the audio stream was incompatible and got dropped. Re-run with `-c:v copy -c:a aac` to copy the video and convert just the audio.',
    'The MP4 will not stream properly on the web: add `-movflags +faststart` during conversion so playback can begin before the download finishes.',
    'Output looks worse than the input: the re-encode used too aggressive a quality setting. Re-encode from the original (not from the degraded MP4) with a lower CRF value like 20.',
    'Conversion is very slow: re-encoding 4K footage is CPU-intensive — this is normal. Use a faster preset (`-preset fast`) or remux instead if the codecs allow it.',
    'Subtitles vanished: MOV subtitle tracks do not always survive the trip. If you need them, extract them first or burn them into the video during re-encoding.',
    'The file plays on your computer but not on a TV or phone: some devices are picky about H.264 profiles. Re-encode with `-profile:v high -level 4.0` for maximum compatibility.',
  ],
  faqs: [
    {
      question: 'Will converting MOV to MP4 reduce quality?',
      answer:
        'Not if you remux: `ffmpeg -i input.mov -c copy output.mp4` copies the streams untouched, so quality is bit-for-bit identical and the conversion takes seconds. Quality loss only happens when re-encoding is required (incompatible codecs), and even then a sensible CRF setting like 20–23 keeps the difference invisible for most viewing. The one exception is metadata: chapter markers, GPS tags, and timecode tracks sometimes do not survive the container swap. If your workflow depends on timecode, test one file end-to-end before batch-converting a whole shoot.',
    },
    {
      question: 'What is the difference between remuxing and re-encoding?',
      answer:
        'Remuxing repackages the existing video and audio streams into a new container without decoding them — fast and lossless, but only works when the streams are already compatible with MP4. Re-encoding decodes everything and compresses it fresh as H.264/AAC — slower and slightly lossy, but works on any input. Always try remuxing first; fall back to re-encoding only if FFmpeg reports incompatible streams.',
    },
    {
      question: 'Can I just rename a .mov file to .mp4?',
      answer:
        'No. Renaming changes the label, not the container or codecs inside. Some forgiving players might still play it, but most software, phones, and upload forms will reject it or behave strangely. A real conversion — even a seconds-long remux — writes a proper MP4 container.',
    },
    {
      question: 'Why is my converted MP4 so much smaller (or larger) than the MOV?',
      answer:
        'If you remuxed, sizes should be nearly identical — a big difference means re-encoding happened. Smaller usually means a lower bitrate or more efficient encoding (fine if it still looks good); larger can happen when converting from an already-efficient codec with conservative settings. Compare visually, not just by megabytes.',
    },
    {
      question: 'Do I need to convert MOV to MP4 for YouTube or social media?',
      answer:
        'YouTube accepts MOV directly, so conversion is optional there — though MP4 with faststart uploads and processes reliably. For Instagram, TikTok, and most messaging apps, MP4 (H.264 + AAC) is the safer choice since MOV support is inconsistent. When in doubt, a remuxed MP4 plays everywhere the MOV did, plus everywhere it did not. One more scenario: video editors. Some editing timelines handle MP4 more smoothly than MOV for the same footage, simply because their MP4 demuxers get more testing — if your editor stutters on a MOV, a remuxed MP4 of the identical streams will often play buttery-smooth with zero quality change.',
    },
  ],
  isInteractiveToolAvailable: false,
  onlineConversionSupported: false,
  speedRating: 'Fast (< 30s)',
  qualityRating: 'Near Lossless',
},
{
  id: 'png-to-svg',
  fromExt: 'PNG',
  toExt: 'SVG',
  name: 'PNG to SVG Converter',
  category: 'Images',
  description:
    'Convert PNG to SVG free: when vectorizing works (logos, icons) and when it fails (photos). Inkscape, Illustrator, and honest online methods.',
  steps: [
    {
      title: 'First, the honest question: should you vectorize this image?',
      desc: 'This is the step most tutorials skip, and it is the most important one. Vectorizing (tracing) converts pixels into mathematical paths — and it only produces good results on the right kind of source. It works beautifully on flat logos, icons, simple illustrations, text-based graphics, and line art: images made of solid colors with clean edges. It fails on photographs, gradients, shadows, and anything with fine texture: the tracer cannot invent the millions of color transitions in a photo, so you get a bloated, posterized mess that looks worse than the PNG and can balloon to many times its file size. Quick test: squint at your image. If you can describe it as "a few flat shapes" — vectorize away. If you see gradients, photographic detail, or subtle shading — keep the PNG. A [PNG](https://anyfilex.com/file-extensions/png) is already the right format for detailed raster graphics; an [SVG](https://anyfilex.com/file-extensions/svg) is the right format for resolution-independent shapes. (For photographic web graphics where file size matters, [WebP](https://anyfilex.com/file-extensions/webp) is the modern raster answer — smaller than PNG, though still not a vector.) Converting between them only makes sense when the image belongs in the destination\'s world. When in doubt, run a quick test trace at low settings first — thirty seconds of previewing tells you more about suitability than any amount of theorizing about your image. A quick word on what SVG actually is, because it shapes every decision below: SVG is an XML-based vector format, meaning the image is described as shapes, paths, and colors in text rather than as a grid of pixels. Tracing — the process converters use — analyzes your PNG\'s pixels and redraws them as vector paths, and open-source engines like Potrace have been doing this reliably for years. The quality of the result depends entirely on how \'traceable\' your source is: sharp edges and flat colors trace into clean, tiny paths, while gradients and noise trace into thousands of messy ones. Understanding that the output is a reinterpretation, not a recovery, keeps expectations honest before you convert anything.',
    },
    {
      title: 'Method 1 — Inkscape Trace Bitmap (free, best control)',
      desc: 'Inkscape (free, open source, from inkscape.org) has the best free tracer available. Import your PNG via File > Open, click it to select it — this matters, tracing only operates on the selected image — then open Path > Trace Bitmap (or Shift+Alt+B). You get two families of options. Single scan produces one path: ideal for black-and-white logos or silhouette-style graphics, where you set a brightness threshold and everything darker becomes a filled shape. Multiple scans produce a group of paths: choose Colors and set the number of scans to the number of distinct colors in your artwork, and Inkscape traces each color band separately, stacking them into a full-color vector. Two options deserve attention: Smooth rounds jagged edges, and Stack scans layers the color paths so nothing shows through. Click Update to preview, tweak until the preview looks clean, then Apply. Delete or hide the original bitmap underneath, and save as Plain SVG. Expect to spend a few minutes tuning — the defaults are a starting point, not a finish line.',
    },
    {
      title: 'Method 2 — Illustrator Image Trace (if you have it)',
      desc: 'Adobe Illustrator\'s Image Trace (Window > Image Trace) is the polished commercial alternative. Select your placed PNG, open the Image Trace panel, and pick a preset: "Black and White Logo" for single-color marks, "3 Colors" or "6 Colors" for simple multicolor graphics, "High Fidelity Photo" if you insist on tracing a photo (expect the enormous, messy result described above). The Advanced section is where quality lives: crank Paths and Corners up for smoother curves, raise Noise to ignore speckles and compression artifacts, and uncheck Snap Curves To Lines only if you want organic rather than geometric curves. Then hit Expand to convert the tracing into editable paths. Illustrator\'s tracer is genuinely better than Inkscape\'s at difficult sources — but "better at tracing a photo" still means "a prettier failure." Use it for logos and illustrations, not photography. After tracing, always hit Expand and ungroup the result so you can delete background shapes and stray paths individually — the raw Image Trace output is a single grouped object that is awkward to edit directly.',
    },
    {
      title: 'Method 3 — Online vectorizers (fastest for simple jobs)',
      desc: 'For a quick logo trace with no install, online auto-tracers like Vectorizer.AI produce impressively clean results on suitable sources — often better than a beginner\'s first Inkscape attempt, because their models were trained specifically on this task. Upload the PNG, wait for the trace, download the SVG. Two honest caveats. First, privacy: you are uploading your image to someone else\'s server, so keep client logos under NDA and unreleased brand work local with Inkscape instead. Second, quality varies with the source exactly as described above — no online tool rescues a photo, and the good ones will show you a preview so you can judge before downloading. For one-off conversions of simple graphics, though, this is legitimately the fastest route from PNG to SVG in existence. Do use the preview reputable vectorizers show you — they render the result before download precisely so you can reject a bad trace without wasting a download.',
    },
    {
      title: 'Method 4 — Command line: potrace and vtracer',
      desc: 'For scripted or batch work, command-line tracers fit into pipelines. Potrace is the classic: it traces black-and-white bitmaps into smooth vector paths (`potrace input.bmp -s -o output.svg` — note it wants a BMP, so convert the PNG first). It is superb at what it does and terrible at everything else: one color, no gradients, which is perfect for engraving, vinyl cutting, and single-color logos. Vtracer is the modern alternative that handles color, built for exactly the PNG-to-SVG job with sensible defaults. The command-line route shines when you have dozens of icons to convert identically, or when tracing is one stage in an automated asset pipeline. For a single logo, the visual feedback of Inkscape will get you a better result faster — use the terminal when you have scale, not when you have one file.',
    },
    {
      title: 'Clean up the trace before you ship it',
      desc: 'Auto-traced SVGs almost always need five minutes of cleanup. First, simplify: tracers generate far more nodes than necessary, and Path > Simplify (in Inkscape) or Object > Path > Simplify (in Illustrator) can cut node counts dramatically with no visible change — smaller file, smoother curves. Second, check the background: if your PNG had a white background you did not want traced, the trace now contains a big white rectangle; delete it or re-trace with the background excluded. Third, look for strays: tiny speck paths from JPEG-style noise or anti-aliasing artifacts, especially around text. Delete them or raise the noise threshold and re-trace. Fourth, verify at multiple sizes: zoom to 1600% to check curve quality, then view at the actual usage size — a trace that looks perfect huge can look muddy as a favicon. Finally, compare against the [JPG](https://anyfilex.com/file-extensions/jpg) original if this started life as a photo someone asked you to "make vector": if the trace looks worse than the source at every size, the honest deliverable is the original raster file, not a bad vector.',
    },
    {
      title: 'When to redraw instead of trace',
      desc: 'There is a point where auto-tracing stops being the right tool, and recognizing it saves hours. If the logo is simple enough — a wordmark in a standard font, geometric shapes, a basic icon — redrawing it by hand in Inkscape or Illustrator often takes less time than cleaning up a trace, and the result is far better: real text objects instead of blobby letterforms, perfect circles instead of hundred-node approximations, clean alignment instead of near-misses. This is especially true for text-heavy graphics: tracers turn lettering into filled outlines that look fine at a glance but fall apart under scrutiny, while re-typesetting takes minutes if you can identify the font. Another red flag is a client asking for "the vector version" of a tiny, low-resolution raster — no trace can recover detail that was never there, and the honest deliverable is either a redraw or a conversation about expectations. Auto-trace is a shortcut for suitable sources, not a magic wand; the best vector artists use it as a starting sketch, then redraw the important parts properly.',
    },
  ],
  recommendedApps: [
    'Inkscape (Trace Bitmap)',
    'Adobe Illustrator (Image Trace)',
    'Vectorizer.AI (online)',
    'potrace (command line)',
    'AnyFileX in-browser converters',
  ],
  commonIssues: [
    'The SVG looks worse than the PNG: the source was a photo or gradient-heavy image — vectorization cannot invent detail. Keep the PNG; not every image should become a vector.',
    'The SVG file is enormous: too many colors scanned, or a photo traced at high fidelity. Reduce scan colors, simplify paths, or accept that this image wants to stay raster.',
    'Text came out as blobby shapes: the tracer converted letterforms to paths, which is normal — but small text traces poorly. For text-heavy graphics, re-typeset the text as real text in the SVG instead.',
    'White box around the graphic: the PNG\'s background got traced as a shape. Delete the background path, or re-trace with background removal enabled.',
    'Jagged edges everywhere: raise the Smooth/Simplify settings, or the source PNG was too low-resolution. Tracing a 200px logo will never yield clean curves — start from the largest source you have.',
    'Gradients turned into ugly bands: tracers approximate gradients with stacked flat shapes. For gradient artwork, either keep the raster original or rebuild the gradient natively as an SVG gradient.',
    'The online tool\'s SVG has a watermark or download limit: use Inkscape locally instead — free, unlimited, and your file never leaves your machine.',
  ],
  faqs: [
    {
      question: 'Will converting PNG to SVG make the file smaller?',
      answer:
        'Sometimes, dramatically — a simple two-color logo can shrink from a 500KB PNG to a 5KB SVG. But a traced photo often becomes larger than the PNG it came from, because thousands of vector paths take more bytes than compressed pixels. Size is a side effect of suitability: if the image vectorizes well, the SVG will be tiny; if it fights you, the PNG was the right format all along.',
    },
    {
      question: 'Can I vectorize a photograph into an SVG?',
      answer:
        'You can run it through a tracer, but you should not ship the result. Tracers reduce photos to posterized blobs of flat color — recognizable at a glance, terrible on inspection, and usually larger than the original photo. SVG is a format for shapes, not for photographic detail. For photos, keep PNG or JPG; reserve vectorization for logos, icons, and illustrations.',
    },
    {
      question: 'Is a traced SVG a "real" vector file?',
      answer:
        'Technically yes — it contains vector paths that scale infinitely. Practically, it depends: a clean trace of a flat logo is every bit as good as a hand-drawn vector for most uses (web, print, cutting machines). But it lacks the intent of a designed file — no named layers, no editable text, no parametric shapes. For professional handoff, a quick cleanup pass (simplify, delete strays, name layers) closes most of the gap.',
    },
    {
      question: 'What is the best free way to convert PNG to SVG?',
      answer:
        'Inkscape\'s Trace Bitmap: free, open source, runs on Windows/Mac/Linux, and gives you full control over scans, smoothing, and colors. Import the PNG, select it, open Path > Trace Bitmap, choose single scan for monochrome art or multiple color scans for multicolor graphics, preview, apply, and save as Plain SVG. Five minutes of setting-tweaking beats any one-click tool for quality. If you outgrow it, the skills transfer directly: Illustrator\'s Image Trace uses the same concepts (thresholds, paths, corners, noise), so time spent learning Inkscape\'s dialog is never wasted.',
    },
    {
      question: 'Do I lose anything converting PNG to SVG and back?',
      answer:
        'Yes — treat it as one-way. PNG to SVG discards pixel-level detail in favor of approximated paths; converting that SVG back to PNG renders the approximation, not the original. Fine detail, subtle gradients, and texture do not survive the round trip. Always keep the original PNG archived, and only ship the SVG when vector is genuinely the better format for the use case. (Need the reverse trip? Our [SVG to PNG tool](https://anyfilex.com/converters/svg-to-png) renders any SVG back to a raster image.)',
    },
  ],
  isInteractiveToolAvailable: false,
  onlineConversionSupported: false,
  speedRating: 'Fast (< 30s)',
  qualityRating: 'Near Lossless',
},
{
  id: 'epub-to-pdf',
  fromExt: 'EPUB',
  toExt: 'PDF',
  name: 'EPUB to PDF Converter',
  category: 'Documents',
  description:
    'Convert EPUB to PDF free — the best method is Calibre (free, private, full control over page size and margins), plus print-to-PDF from any e-reader app and honest online options. But first: should you? EPUB is reflowable — it reshapes itself to any screen — while PDF freezes a fixed layout. Converting makes sense for printing, for accessibility tools that expect PDF, or when the recipient specifically needs one. For everyday reading on a phone or e-reader, keep the EPUB. This guide covers the legitimate uses and the methods that work — plus the DRM caveat: only files you own or that are DRM-free can be converted.',
  steps: [
    {
      title: 'Calibre on desktop — the best free method',
      desc: 'Calibre is the free, open-source ebook manager that has been the standard answer for ebook conversion for well over a decade, and EPUB to PDF is one of its core jobs. Download it from calibre-ebook.com (Windows, macOS, and Linux are all supported) and install it. Open Calibre, click "Add books" in the top-left, and select your EPUB — it appears in your library. Select it, then click "Convert books" in the toolbar and choose "Convert individually." In the dialog that opens, set the output format to PDF in the top-right corner. Before you click OK, look at the left sidebar: "Page setup" lets you pick the target profile (default is fine for screen reading; choose a print-oriented profile if this PDF is headed for paper), and "Look & feel" controls fonts and spacing. Click OK and watch the "Jobs" indicator in the bottom-right — when it hits 0, the conversion is done. Right-click the book, choose "Open containing folder," and your PDF is there. Two honest caveats from experience: Calibre\'s PDF rendering can struggle with complex layouts, multi-column designs, and unusual embedded fonts, so always open the result and check it before sending it anywhere. And Calibre refuses DRM-protected ebooks outright — it will show an error rather than convert them, which is by design. Everything happens locally on your computer: nothing is uploaded anywhere, which is exactly what you want for personal documents.',
    },
    {
      title: 'The command-line route — ebook-convert for batches',
      desc: 'If you have a whole folder of EPUBs to convert — say, a set of public-domain books or a batch of reports you generated — clicking through Calibre\'s GUI one file at a time gets old fast. Calibre ships with a command-line tool called ebook-convert that exposes the same conversion engine with flags. The basic form is simple: `ebook-convert input.epub output.pdf`. That alone handles most cases. When you care about the output, add page controls: `ebook-convert input.epub output.pdf --paper-size a4 --pdf-page-margin-left 72 --pdf-page-margin-right 72` sets A4 pages with comfortable one-inch margins (72 points equals one inch). For a whole directory, wrap it in a loop — on macOS or Linux: `for file in *.epub; do ebook-convert "$file" "${file%.epub}.pdf"; done`. On Windows, the same idea works in PowerShell with a foreach loop. The CLI uses the same rendering engine as the GUI, so the same caveats apply: check complex layouts in the output, and DRM-protected files will error out rather than convert. Where the CLI shines is repeatability — once you find settings you like, save the command and every future conversion looks identical. That matters for things like converting a monthly report series or a full bookshelf of public-domain classics with consistent formatting.',
    },
    {
      title: 'Print to PDF from any e-reader app',
      desc: 'Here is the method most people overlook: if you can open the EPUB in a reading app, you can "print" it to a PDF using your operating system\'s built-in PDF printer, no converter needed. On Windows 10 and 11, open the EPUB in your reader app of choice, press Ctrl + P (or find Print in the menu), and select "Microsoft Print to PDF" as the printer. Choose your paper size and orientation, click Print, and save. On a Mac, open the book in Books or any EPUB reader, choose File > Print, then click the PDF button in the bottom-left of the print dialog and select "Save as PDF." This route has a real advantage: you see exactly what the pages will look like before committing, because you are printing the rendered view. The tradeoff is control — you get the app\'s default typography and whatever page breaks it chooses, with none of Calibre\'s margin and font tuning. It is also page-by-page manual work, so it suits one-off conversions, not batches. One more honest note: some reading apps paginate oddly when printing (chapter breaks in strange places, or the table of contents rendering as plain text). For a quick PDF of a short document it is perfectly fine; for a 400-page book you actually care about, use Calibre.',
    },
    {
      title: 'Online converters — convenient, with two caveats',
      desc: 'Browser-based EPUB-to-PDF converters exist and they work: upload the EPUB, wait a few seconds, download the PDF. For a single, non-sensitive file on a device where you cannot install software — a work computer, a Chromebook, a phone — they are genuinely the fastest route. But there are two caveats you should take seriously, and most converter sites will not volunteer either of them. First, privacy: your file is uploaded to someone else\'s server, processed there, and (you are told) deleted after. For a public-domain classic or your own draft manuscript that is merely inconvenient; for anything personal, contractual, or unpublished, it is a real exposure — prefer the offline methods above. Second, DRM: reputable online converters reject DRM-protected ebooks just like Calibre does, and any site that claims to strip copy protection for you is asking you to upload a file you do not have the right to convert, which is both a terms-of-service violation and, in many places, unlawful. Stick to files you own outright or that are DRM-free (public-domain books, your own exports, Creative Commons works), and treat online conversion as the convenience option, not the default.',
    },
    {
      title: 'When NOT to convert — keep the EPUB',
      desc: 'Conversion guides rarely say this, but it matters: most of the time, you should not convert at all. EPUB is the better reading format by design. It reflows — the text reshapes itself to your phone, your tablet, your e-reader, your font size, your line spacing. A PDF cannot do any of that; it is a photograph of pages. Convert an EPUB to PDF and read it on a phone, and you will be pinch-zooming and panning sideways on every page, which is miserable. So before converting, ask what problem you are actually solving. Reading on a Kindle? Amazon has accepted EPUB files through Send to Kindle since 2022 — just send the EPUB as-is. Reading on an iPad or Android tablet? Apple Books, Google Play Books, and a dozen free apps open EPUB natively. Archiving? EPUB is an open standard that will outlive any single vendor\'s app. Convert only when the destination genuinely demands a fixed layout: printing on paper, submitting to a system that only accepts PDF, accessibility workflows built around tagged PDFs, or sending to someone whose device cannot open EPUB. If none of those apply, the best conversion is the one you skip.',
    },
    {
      title: 'Fixing the output — fonts, page size, and table of contents',
      desc: 'EPUB-to-PDF conversions have a characteristic set of cosmetic problems, and nearly all of them are fixable with one more pass. Problem one: the PDF uses an ugly fallback font. That happens when the EPUB references fonts that are not embedded and your system does not have them either. In Calibre, go to "Look & feel" in the conversion dialog and set an explicit base font you know exists on your machine, or embed the font if you have the rights to it. Problem two: pages are the wrong size — tiny text swimming in huge margins, or text cut off at the edges. That is the page profile: re-run the conversion with the "Page setup" profile matched to your actual use (screen vs. print) and set the paper size explicitly rather than leaving it on default. Problem three: the table of contents is missing or broken. EPUB navigation and PDF bookmarks are different structures; Calibre usually maps them, but complex or hand-built TOCs can fail. Check "Table of Contents" in the conversion dialog and force chapter detection from headings if the automatic TOC comes out empty. Problem four: images look soft or oversized. EPUB images are sized for screens; in a fixed-layout PDF they can blow up or pixelate. There is no magic fix — check the worst pages and, if images matter (illustrated books, manuals), consider whether PDF was the right target at all. The general rule: convert once, inspect the result end to end, adjust one setting, and convert again. Two passes beat ten minutes of fiddling with settings blind.',
    },
  ],
  recommendedApps: [
    'Calibre',
    'ebook-convert (Calibre CLI)',
    'Microsoft Print to PDF',
    'Preview (macOS)',
    'Apple Books',
  ],
  commonIssues: [
    'DRM-protected ebooks will not convert — Calibre shows an error by design, and no legitimate method here bypasses copy protection. Only convert files you own or that are DRM-free.',
    'Complex layouts often render imperfectly: multi-column pages, drop caps, and custom fonts are the usual casualties. Always inspect the PDF before sending it on.',
    'The output PDF can be much larger than the EPUB, especially with image-heavy books, because fixed-layout pages embed rendered content rather than reflowable text.',
    'Page numbers in the PDF will not match any print edition of the same book — do not cite them as if they do.',
    'Online converters upload your file to a third-party server; avoid them for personal, unpublished, or sensitive documents.',
    'Converting for phone reading is usually a mistake — EPUB reflows to small screens and PDF does not. Send EPUBs to Kindle or a reading app instead.',
    'Fonts may substitute silently if the EPUB references fonts neither embedded nor installed; set an explicit base font in Calibre to control this.',
    'A broken or missing table of contents usually means the EPUB\'s navigation did not map to PDF bookmarks — force chapter detection from headings and re-run.',
  ],
  faqs: [
    {
      question: 'Is it legal to convert EPUB to PDF?',
      answer:
        'Converting files you own or that are DRM-free — your own manuscripts, public-domain books, Creative Commons works, work documents — is fine. What you cannot do is strip DRM copy protection from purchased ebooks to convert them; Calibre and reputable converters refuse those files by design. When in doubt, the rule is simple: if you have the right to read it without restriction, you can convert it for personal use.',
    },
    {
      question: 'Will the PDF look exactly like the EPUB?',
      answer:
        'No — and that is the fundamental tradeoff. EPUB is reflowable text that adapts to any screen; PDF is a fixed snapshot of pages. The words and images carry over, but pagination, font rendering, and layout will differ, sometimes noticeably with complex designs. If pixel-perfect fidelity matters (a designed report, an illustrated book), proof the PDF carefully and adjust Calibre\'s page setup before finalizing.',
    },
    {
      question: 'Why is my converted PDF so much bigger than the EPUB?',
      answer:
        'EPUBs are essentially zipped websites — compact by nature. A PDF embeds rendered pages, fonts, and images in fixed positions, which takes more space, particularly for image-heavy books. If size matters (email attachments, uploads), try Calibre with default rather than print-quality settings, and check whether embedded fonts are inflating the file.',
    },
    {
      question: 'Can I convert Kindle books to PDF?',
      answer:
        'Only if they are DRM-free. Amazon\'s Kindle books are typically protected, and Calibre will error out on them rather than convert. For DRM-free Kindle books (including many public-domain titles), the same Calibre workflow applies. Do not use tools that promise to strip Kindle DRM — that is a different legal territory from format conversion.',
    },
    {
      question: 'Should I convert EPUB to PDF for reading on my phone?',
      answer:
        'Almost certainly not. Phones are where EPUB\'s reflowable design shines and where PDF\'s fixed pages hurt most — you will be zooming and panning constantly. Send the EPUB to a reading app (Kindle, Apple Books, Google Play Books all accept EPUB) and keep the PDF conversion for printing, archiving, or recipients who specifically need PDF.',
    },
  ],
  isInteractiveToolAvailable: false,
  onlineConversionSupported: false,
  speedRating: 'Fast (< 30s)',
  qualityRating: 'Near Lossless',
},
{
  id: 'avi-to-mp4',
  fromExt: 'AVI',
  toExt: 'MP4',
  name: 'AVI to MP4 Converter',
  category: 'Video',
  description:
    'Convert AVI to MP4 free — without losing quality. AVI is a 1990s-era container that modern phones, TVs, and browsers increasingly refuse to play, while MP4 plays on virtually everything. The good news: many AVIs convert losslessly in seconds by repackaging the streams into an MP4 container (remuxing) — no re-encoding, no quality loss. When that fails, a careful re-encode preserves everything the eye can see. Written for the classic case: old family videos, CamStudio captures, decade-old archives. Covers the lossless-first workflow, batch conversion, GUI alternatives — and one privacy note: this is personal footage, so keep it off strangers’ servers.',
  steps: [
    {
      title: 'First, check what is actually inside your AVI',
      desc: 'AVI is a container, not a codec — it is a box, and the video and audio inside can be encoded a dozen different ways. A 2008 family video might hold DV video, an old game capture might hold a niche codec like CamStudio\'s, and a downloaded clip might hold Xvid. Which conversion path works depends on what is in the box, so spend sixty seconds finding out before you convert. The easiest check: open the file in VLC media player (free), go to Tools > Codec Information, and read the video and audio codec names. If you have FFmpeg installed, `ffprobe -hide_banner input.avi` prints the same information in the terminal. Why this matters: the lossless remux method below only works when the codecs inside your AVI are also legal inside an MP4 container. H.264 video or AAC/MP3 audio? Remux will almost certainly work. DV video, or something exotic like an old Indeo or Cinepak codec? You will need to re-encode instead. Knowing this upfront saves you from the classic failure mode: a "successful" conversion that produces an MP4 nothing can play, because an incompatible codec got copied into a container that does not support it. Write down the video codec, the audio codec, and the resolution — you will use all three in the steps below.',
    },
    {
      title: 'Try the lossless remux first — 30 seconds, zero quality loss',
      desc: 'Remuxing means changing the container without touching the encoded video and audio — like pouring cereal from one box into another. Nothing is re-encoded, so quality is mathematically identical to the original, and it typically finishes in seconds even for large files. The command, using the free and open-source FFmpeg: `ffmpeg -i input.avi -c:v copy -c:a copy output.mp4`. The `-c:v copy` and `-c:a copy` flags tell FFmpeg to copy the video and audio streams bit-for-bit instead of re-encoding them. Download FFmpeg from ffmpeg.org if you do not have it (Windows users: download a build, unzip it anywhere, and either add it to your PATH or run it from that folder). Then open a terminal in the folder with your AVI and run the command with your real filenames. When it works — and for AVIs holding H.264 video or MP3/AAC audio it usually does — you get a perfect MP4 in seconds. When it does not work, FFmpeg will complain loudly (errors about codecs "not currently supported in container" or an unplayable output file). That is not a disaster; it just means your AVI\'s codecs are not MP4-legal, and you move to the re-encode step below. Either way, this attempt costs you almost nothing: keep the original AVI until you have verified the MP4 plays correctly, then decide whether to keep both.',
    },
    {
      title: 'Re-encode properly when remux is not an option',
      desc: 'If remuxing failed — or if you checked the codecs in step one and already know they are not MP4-compatible — re-encoding is the reliable path. Re-encoding decompresses the video and compresses it again into a modern codec, which always loses a little quality, but done right the loss is invisible. The command: `ffmpeg -i input.avi -c:v libx264 -crf 18 -preset medium -c:a aac -b:a 192k output.mp4`. Here is what each part does, because blindly pasting commands is how people end up with terrible output. `-c:v libx264` selects the H.264 video codec — the universal standard that plays on every phone, TV, and browser made in the last fifteen years. `-crf 18` sets the quality: CRF (Constant Rate Factor) runs from 0 (lossless) to 51 (worst), the default is 23, and 18 is the sweet spot for archival work — visually indistinguishable from the source for most footage, at a reasonable file size. Lower than 18 buys you almost nothing visible and much bigger files. `-preset medium` balances encoding speed against compression efficiency; `slow` squeezes smaller files out of the same quality if you have time, `fast` if you do not. `-c:a aac -b:a 192k` converts the audio to AAC at 192 kbps, which is transparent for typical home-video audio. One warning for irreplaceable footage: never re-encode twice. Each lossy generation discards a little more detail, so convert once from the original AVI and archive the result — do not convert the MP4 again later "to make it smaller."',
    },
    {
      title: 'Batch-convert a whole folder of old videos',
      desc: 'Nobody has one AVI. You have a folder called "videos 2009" with forty of them, and converting them one at a time is a weekend you will never get back. FFmpeg plus a loop handles the whole folder unattended. On macOS or Linux, in the folder with your AVIs: `for i in *.avi; do ffmpeg -i "$i" -c:v libx264 -preset fast -c:a aac "${i%.avi}.mp4"; done`. On Windows Command Prompt: `FOR %G IN (*.avi) DO ffmpeg -i "%G" -c:v libx264 -preset fast -c:a aac "%~nG.mp4"`. (In PowerShell the syntax differs — the CMD version above is the one to use in a classic Command Prompt window.) A few practical notes from people who have done this at scale. First, run it overnight: re-encoding is CPU-heavy, and forty videos will take hours — that is normal. Second, use `-preset fast` for batches rather than `medium`; the quality difference is small and the time saving is large. Third, spot-check the first two outputs completely before letting the rest run — play them, check audio sync, confirm the length matches. If something is wrong with your settings, you want to discover it on video one, not video forty. Fourth, keep the originals until the whole batch is verified; disk space is cheap, and 2009 cannot be re-shot.',
    },
    {
      title: 'VLC — the no-command-line method',
      desc: 'If the terminal makes you nervous, VLC media player (free, from videolan.org) converts AVI to MP4 with clicks instead of commands. Open VLC, go to Media > Convert / Save, click Add, and select your AVI. Click "Convert / Save" at the bottom, and in the dialog that appears set the Profile to "Video - H.264 + MP3 (MP4)". Choose a destination filename ending in .mp4, click Start, and wait. That is genuinely all of it. Under the hood VLC is doing the same re-encode described above with sensible defaults, so expect the same quality tradeoff: a small, invisible-to-the-eye loss in exchange for universal compatibility. Two things to know. First, VLC\'s default profile uses MP3 audio rather than AAC; MP3-in-MP4 plays everywhere in practice, but if you want strict standards compliance, click the wrench icon next to the profile and change the audio codec to AAC (MPEG-4 Audio). Second, VLC gives you no remux option in this dialog — it always re-encodes. If you specifically want the lossless remux path, FFmpeg is the tool. For most family-video purposes, though, VLC\'s output is perfectly good, and the zero-learning-curve factor is real: this is the method to recommend to relatives.',
    },
    {
      title: 'HandBrake — the friendly GUI alternative',
      desc: 'HandBrake (free, open-source, from handbrake.fr) sits between VLC\'s simplicity and FFmpeg\'s power: a proper graphical interface with real quality controls. Open HandBrake, drag in your AVI (or use "Open Source" to browse for it), and it will scan the file. On the Summary tab, confirm the format is MP4. On the Video tab, set the Video Encoder to "H.264 (x264)" and drag the Quality slider to RF 18–20 for archival-grade output — HandBrake\'s RF scale is the same idea as FFmpeg\'s CRF, just inverted in presentation. On the Audio tab, make sure the codec is AAC. Then click "Start Encode." Where HandBrake earns its place: deinterlacing. Old footage — especially anything from MiniDV tapes or early digital cameras — is often interlaced, which shows as ugly horizontal "combing" on moving objects when played on modern progressive displays. HandBrake\'s Filters tab has a Deinterlace option (set it to Decomb, the adaptive mode) that fixes this during conversion; FFmpeg can do it too, but HandBrake makes it a checkbox. If your AVIs show combing artifacts, HandBrake is arguably the better tool than a plain FFmpeg re-encode. The cost is speed: HandBrake with quality settings is slower than VLC\'s defaults, so queue the folder (HandBrake has a built-in queue — "Add to Queue" per file) and let it run overnight.',
    },
    {
      title: 'When conversion fails — damaged files and weird codecs',
      desc: 'Old AVIs fail in characteristic ways, and the fix depends on the symptom. "Could not find tag for codec" or "codec not currently supported in container" from FFmpeg means exactly what it says: the AVI holds a codec MP4 cannot contain. Drop the `-c:v copy` flags and re-encode fully (step three) — that resolves the large majority of these. Audio that drifts out of sync usually means the AVI has variable-frame-rate quirks or a damaged index; try adding `-fflags +genpts` before `-i`, or re-encode with `-async 1` for the audio. A file that will not open in anything — not VLC, not FFmpeg — may be genuinely damaged: try VLC\'s built-in repair (it prompts to fix broken AVI indexes on open; always let it try), and if the file came from a download rather than your own camera, re-download it. CamStudio captures deserve a special mention: very old CamStudio AVIs use a proprietary codec that modern FFmpeg builds may not decode. If `ffprobe` reports an unknown codec, install the CamStudio codec on Windows and play/convert through VirtualDub or VLC on that machine — this is one of the few cases where the Windows-only path is genuinely easier. And the golden rule for all of it: never delete the original AVI until the MP4 has been watched end to end. A conversion that "completed" is not a conversion that worked.',
    },
  ],
  recommendedApps: [
    'FFmpeg',
    'VLC media player',
    'HandBrake',
  ],
  commonIssues: [
    'Remux produced an MP4 that will not play: the AVI\'s codecs are not MP4-compatible. Re-encode fully with libx264/AAC instead of copying streams.',
    'Audio drifts out of sync: common with old captures and damaged indexes. Try -fflags +genpts before the input, or re-encode audio with -async 1.',
    'The output is much bigger than expected: CRF values below 18 buy almost no visible quality for large size increases; 18–20 is the archival sweet spot.',
    'Combing artifacts on movement: the source is interlaced (typical of MiniDV-era footage). Deinterlace during conversion — HandBrake\'s Decomb filter is the easy path.',
    'No audio in the output: the AVI\'s audio codec was not mapped. Check with ffprobe and set -c:a aac explicitly rather than relying on defaults.',
    'Subtitles disappeared: AVI-era subtitles are often separate files or embedded in ways MP4 does not carry over automatically. Extract them first if they matter.',
    'FFmpeg reports "unknown codec" on very old captures (e.g., CamStudio): use the original Windows codec via VirtualDub or VLC on Windows for those files.',
    'Uploading family footage to random online converters: personal videos deserve better — prefer the offline methods above so the footage never leaves your devices.',
  ],
  faqs: [
    {
      question: 'Will converting AVI to MP4 lose quality?',
      answer:
        'Not if you remux: copying the streams into an MP4 container with -c:v copy -c:a copy changes zero bytes of video or audio, so quality is mathematically identical. That only works when the AVI\'s codecs are MP4-compatible. If you must re-encode, use libx264 at CRF 18 — the loss is real but invisible to the human eye for typical home footage. What you must never do is re-encode twice: every lossy generation discards more detail, so convert once from the original and stop.',
    },
    {
      question: 'Why is my MP4 bigger than the original AVI?',
      answer:
        'Usually because the re-encode settings were too generous — CRF below 18, or a slow preset preserving film grain and noise bit-for-bit. Old footage is often noisy, and noise is expensive to compress; the encoder faithfully preserves every speck of it. CRF 18–20 with the medium preset is the sane archival range. If the file must be smaller (say, for sharing), raise the CRF to 21–23 rather than re-encoding the MP4 a second time — always go back to the original AVI.',
    },
    {
      question: 'What does remuxing actually mean?',
      answer:
        'Think of a video file as a box (the container: AVI, MP4, MKV) holding encoded streams (the codecs: H.264 video, AAC audio). Remuxing pours the streams from one box into another without re-encoding anything — fast, lossless, and done in seconds. It works whenever the streams are legal in both containers. Re-encoding, by contrast, decompresses and recompresses the actual video, which takes much longer and always loses a little quality. Always try remux first; fall back to re-encode when the codecs are incompatible.',
    },
    {
      question: 'Can I convert AVI to MP4 on a Mac?',
      answer:
        'Yes. FFmpeg has macOS builds (install via Homebrew with brew install ffmpeg, or download a static build from ffmpeg.org), and the exact same commands work in Terminal. HandBrake and VLC both have full Mac versions with the same features as Windows. QuickTime Player itself cannot do this conversion — use one of the three tools above instead.',
    },
    {
      question: 'How long does it take to convert a batch of old videos?',
      answer:
        'Remuxing is nearly instant — seconds per file regardless of length. Re-encoding is CPU-bound: roughly real-time to several times real-time depending on your processor, the preset, and the resolution. A folder of forty hour-long AVIs re-encoded overnight is a normal, expected timeline — queue them with HandBrake or a shell loop and let it run. Do not use your computer for heavy work simultaneously; video encoding wants all the cores it can get.',
    },
  ],
  isInteractiveToolAvailable: false,
  onlineConversionSupported: false,
  speedRating: 'Medium (< 2m)',
  qualityRating: 'Near Lossless',
},
];
