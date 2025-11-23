# Hero Section Backup - Full Width Layout

**Date:** October 19, 2025
**Version:** Full-width background with centered text

## Original HTML Structure

```html
<section id="hero" class="hero">
    <div id="home-section-background"></div>
    <div id="home-section-content" class="hero-content">
        <div class="hero-text">
            <h1 class="hero-title">w33s3</h1>
            <h2 class="hero-subtitle">Technology Portfolio</h2>
            <p class="hero-description">
                When I co-founded Bioscape Digital in 2013, I saw healthcare struggling with a fundamental problem: patients were disconnected from their care experience, sitting in hospital beds with no way to understand their treatment or communicate effectively with their care teams. We built a tablet-based, bedside solution that integrates text, audio and 3D visual imagery into an intuitive touch screen experience, allowing providers to overcome language and education barriers. Over 11 years, I architected and scaled the CarePrime platform from a startup concept to an enterprise solution now serving 140+ healthcare facilities, transforming how patients engage with their healthcare journey at the most critical moment: the point of care.
            </p>
            <div class="hero-stats">
                <div class="stat-item">
                    <span class="stat-number">1500+</span>
                    <span class="stat-label">Cataloged Modules</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">24/7</span>
                    <span class="stat-label">Patient Engagement</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">99.9%</span>
                    <span class="stat-label">Uptime</span>
                </div>
            </div>
            <div class="hero-cta">
                <a href="#overview" class="btn-primary">Explore Platform</a>
                <a href="#demos" class="btn-secondary">View Demos</a>
            </div>
        </div>
    </div>
</section>
```

## Original CSS (styles.css)

```css
/* Hero Section */
.hero {
    min-height: calc(100vh - 70px);
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    margin-top: 70px;
}

#home-section-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
}

#home-section-background canvas {
    display: block;
}

.hero::before {
    display: none;
}

.hero-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 3rem;
    position: relative;
    z-index: 1;
}

.hero-text {
    max-width: 800px;
    text-align: left;
    padding: 0 1rem;
}

.hero-title {
    font-size: 3rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.75rem;
    line-height: 1.1;
}

.hero-subtitle {
    font-size: 1.25rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 1.25rem;
}

.hero-description {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 2.5rem;
    max-width: 700px;
    line-height: 1.6;
}

.hero-stats {
    display: flex;
    gap: 3rem;
    margin-bottom: 3rem;
}

.stat-item {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    line-height: 1;
}

.stat-label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
}

.hero-cta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}
```

## To Revert to This Layout

1. Replace the hero HTML section in `index.html` with the HTML above
2. Replace the hero CSS in `styles.css` with the CSS above
3. No changes needed to `hero-background.js` (works with both layouts)

## Notes

- Background covers full viewport width
- Text content centered on page
- Network graph animation visible behind all text
- White text with semi-transparent backgrounds for readability
