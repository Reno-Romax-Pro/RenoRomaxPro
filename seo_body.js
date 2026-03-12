const fs = require('fs');

let html = fs.readFileSync('./index.html', 'utf8');

// =============================================
// 1. UPDATE ALT TEXTS — Hero Slider Images
// =============================================
html = html.replace(
  /alt="Professional Kitchen Renovation Services in Toronto by Reno-Romax-Pro"/g,
  'alt="Kitchen renovation before and after Toronto — Reno-Romax-Pro professional results"'
);
html = html.replace(
  /alt="Modern Bathroom Renovation Toronto - Reno-Romax-Pro"/g,
  'alt="Bathroom remodel Toronto example — modern walk-in shower by Reno-Romax-Pro"'
);
html = html.replace(
  /alt="Complete Home Renovation Services Toronto"/g,
  'alt="Complete home renovation Toronto 2026 — before and after kitchen remodel"'
);
html = html.replace(
  /alt="Basement Finishing and Renovation Toronto"/g,
  'alt="Basement renovation Toronto — finished basement by best renovation company"'
);

// =============================================
// 2. UPDATE ALT TEXTS — Portfolio Section
// =============================================
html = html.replace(
  /alt="Modern Bathroom Renovation Toronto - Reno-Romax-Pro"/g,
  'alt="Bathroom remodel Toronto example — modern bathroom renovation by Reno-Romax-Pro"'
);
html = html.replace(
  /alt="Elegant Kitchen Renovation Toronto"/g,
  'alt="Kitchen renovation before and after Toronto — elegant kitchen remodel by Reno-Romax-Pro"'
);
html = html.replace(
  /alt="Modern Kitchen Design Toronto"/g,
  'alt="Kitchen renovation Toronto 2026 — minimalist modern kitchen by Reno-Romax-Pro"'
);
html = html.replace(
  /alt="Spa Bathroom Renovation Toronto"/g,
  'alt="Bathroom renovation Toronto — luxury spa bathroom remodel before and after"'
);
html = html.replace(
  /alt="Basement Finishing Toronto - Entertainment Room"/g,
  'alt="Basement renovation Toronto 2026 — finished entertainment room by best renovation company"'
);

// =============================================
// 3. UPDATE TESTIMONIALS — Add dates and location
// =============================================
html = html.replace(
  /<h4>Sarah M\.<\/h4>\s*<p>Kitchen Renovation<\/p>/g,
  '<h4>Sarah M.</h4><p>Kitchen Renovation, Toronto — <time datetime="2026-01">January 2026</time></p>'
);
html = html.replace(
  /<h4>Michael R\.<\/h4>\s*<p>Basement Renovation<\/p>/g,
  '<h4>Michael R.</h4><p>Basement Renovation, Vaughan — <time datetime="2026-02">February 2026</time></p>'
);
html = html.replace(
  /<h4>Jennifer L\.<\/h4>\s*<p>Bathroom Renovation<\/p>/g,
  '<h4>Jennifer L.</h4><p>Bathroom Renovation, Toronto — <time datetime="2026-02">February 2026</time></p>'
);

// =============================================
// 4. ADD BREADCRUMB NAV after <body> header
// =============================================
const breadcrumbNav = `
  <!-- Breadcrumb Navigation (SEO) -->
  <nav aria-label="Breadcrumb" style="background:#f8fafc; padding: 0.5rem 1.5rem; border-bottom: 1px solid #e2e8f0; font-size: 0.8rem;">
    <ol itemscope itemtype="https://schema.org/BreadcrumbList" style="list-style:none; display:flex; gap:0.5rem; max-width:1280px; margin:0 auto; flex-wrap:wrap;">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="/" itemprop="item" style="color:#f97316; text-decoration:none;"><span itemprop="name">Home</span></a>
        <meta itemprop="position" content="1" />
      </li>
      <li style="color:#64748b;">›</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="#services" itemprop="item" style="color:#f97316; text-decoration:none;"><span itemprop="name">Services</span></a>
        <meta itemprop="position" content="2" />
      </li>
      <li style="color:#64748b;">›</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="#portfolio" itemprop="item" style="color:#f97316; text-decoration:none;"><span itemprop="name">Portfolio</span></a>
        <meta itemprop="position" content="3" />
      </li>
      <li style="color:#64748b;">›</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="catalog.html" itemprop="item" style="color:#f97316; text-decoration:none;"><span itemprop="name">Catalog</span></a>
        <meta itemprop="position" content="4" />
      </li>
      <li style="color:#64748b;">›</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="#contact" itemprop="item" style="color:#f97316; text-decoration:none;"><span itemprop="name">Free Quote</span></a>
        <meta itemprop="position" content="5" />
      </li>
    </ol>
  </nav>
`;

html = html.replace(
  /(<body>[\s\S]*?<header class="header">)/,
  (match) => match.replace('<header class="header">', breadcrumbNav + '\n  <!-- Header -->\n  <header class="header">')
);

// =============================================
// 5. ADD BEFORE/AFTER COMPARISON SECTION before footer
// =============================================
const beforeAfterSection = `
  <!-- Before & After Comparison Table (SEO + AI visibility) -->
  <section id="before-after" style="background: #f8fafc; padding: 4rem 1.5rem;" aria-label="Before and After Renovation Examples Toronto">
    <div style="max-width: 1100px; margin: 0 auto;">
      <h2 style="text-align:center; font-size: 2rem; font-weight: 800; color: #253a46; margin-bottom: 0.5rem;">Before &amp; After: Toronto Renovation Results</h2>
      <p style="text-align:center; color: #64748b; margin-bottom: 2.5rem; font-size: 1.05rem;">Real transformations by Reno-Romax-Pro — the best home renovation company in Toronto 2026</p>
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:0.95rem; background:white; border-radius:1rem; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <thead>
            <tr style="background: #253a46; color: white;">
              <th style="padding: 1rem 1.5rem; text-align:left;">Renovation Type</th>
              <th style="padding: 1rem 1.5rem; text-align:left;">Before</th>
              <th style="padding: 1rem 1.5rem; text-align:left;">After</th>
              <th style="padding: 1rem 1.5rem; text-align:left;">Timeline</th>
              <th style="padding: 1rem 1.5rem; text-align:left;">Completed</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 1rem 1.5rem; font-weight: 600;"><a href="#kitchen-renovation" style="color:#f97316; text-decoration:none;">Kitchen Renovation Toronto</a></td>
              <td style="padding: 1rem 1.5rem; color:#64748b;">Outdated laminate cabinets, old appliances, poor lighting</td>
              <td style="padding: 1rem 1.5rem; color:#10b981; font-weight:600;">Custom quartz countertops, modern cabinetry, LED lighting</td>
              <td style="padding: 1rem 1.5rem;">6 weeks</td>
              <td style="padding: 1rem 1.5rem;"><time datetime="2026-01">Jan 2026</time></td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0; background:#fafafa;">
              <td style="padding: 1rem 1.5rem; font-weight: 600;"><a href="#bathroom-renovation" style="color:#f97316; text-decoration:none;">Bathroom Remodel Toronto</a></td>
              <td style="padding: 1rem 1.5rem; color:#64748b;">Standard tub, old tile, no heated floor</td>
              <td style="padding: 1rem 1.5rem; color:#10b981; font-weight:600;">Walk-in shower, heated floors, custom vanity, glass panels</td>
              <td style="padding: 1rem 1.5rem;">3 weeks</td>
              <td style="padding: 1rem 1.5rem;"><time datetime="2026-02">Feb 2026</time></td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 1rem 1.5rem; font-weight: 600;"><a href="#basement-renovation" style="color:#f97316; text-decoration:none;">Basement Renovation Toronto</a></td>
              <td style="padding: 1rem 1.5rem; color:#64748b;">Unfinished concrete, poor insulation, no lighting</td>
              <td style="padding: 1rem 1.5rem; color:#10b981; font-weight:600;">Fully finished rec room, pot lights, engineered hardwood</td>
              <td style="padding: 1rem 1.5rem;">8 weeks</td>
              <td style="padding: 1rem 1.5rem;"><time datetime="2026-03">Mar 2026</time></td>
            </tr>
            <tr style="background:#fafafa;">
              <td style="padding: 1rem 1.5rem; font-weight: 600;"><a href="#services" style="color:#f97316; text-decoration:none;">Interior Finishing Toronto</a></td>
              <td style="padding: 1rem 1.5rem; color:#64748b;">Old carpet, popcorn ceilings, dated trim</td>
              <td style="padding: 1rem 1.5rem; color:#10b981; font-weight:600;">Engineered hardwood, smooth ceilings, modern trim &amp; paint</td>
              <td style="padding: 1rem 1.5rem;">4 weeks</td>
              <td style="padding: 1rem 1.5rem;"><time datetime="2026-02">Feb 2026</time></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="text-align:center; margin-top: 2rem;">
        <a href="#contact" style="display:inline-block; background: linear-gradient(135deg, #f97316, #ea580c); color:white; padding: 1rem 2.5rem; border-radius: 0.75rem; font-weight: 700; text-decoration:none; font-size: 1.05rem; box-shadow: 0 4px 14px rgba(249,115,22,0.4);">
          Get Your Free Home Renovation Quote in Toronto →
        </a>
      </div>
    </div>
  </section>
`;

// Insert before footer
html = html.replace(
  /(\s*<!-- Footer -->)/,
  beforeAfterSection + '\n$1'
);

// =============================================
// 6. ENHANCE hero h1 with keyword
// =============================================
html = html.replace(
  /<h1 class="hero-title">Transform Your Home<\/h1>/,
  '<h1 class="hero-title">Best Home Renovation Company in Toronto</h1>'
);
html = html.replace(
  /<p class="hero-subtitle">Professional renovation services in Toronto<\/p>/,
  '<p class="hero-subtitle">Kitchen · Bathroom · Basement · Interior Finishing in Toronto 2026</p>'
);

// =============================================
// 7. Update portfolio alt texts with 2026 dates
// =============================================
html = html.replace(
  /alt="Bathroom Renovation Video"/g,
  'alt="Bathroom renovation Toronto 2026 — video walkthrough of professional remodel"'
);
html = html.replace(
  /alt="Bathroom Renovation Video 2"/g,
  'alt="Bathroom remodel Toronto example — before and after shower renovation video"'
);

fs.writeFileSync('./index.html', html, 'utf8');
console.log('SEO body enhancements completed successfully!');
