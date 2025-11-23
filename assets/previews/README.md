# Video Preview Images

This folder contains poster/preview images for the demo videos in the Platform Demonstrations section.

## Required Images

Place the following preview images in this folder:

### 1. anatomy-reference-preview.jpg
- **Source:** Anatomy Reference System screenshot (skeleton with organs visible)
- **Recommended size:** 1280x720px (16:9 aspect ratio)
- **Description:** Shows the 3D interactive anatomy viewer with skeleton and internal organs
- **Video:** AnatomyReference.m4v

### 2. infusion-management-preview.jpg
- **Source:** Screenshot from InfuseClip.mp4
- **Recommended size:** 1280x720px (16:9 aspect ratio)
- **Description:** Infusion management interface preview
- **Video:** InfuseClip.mp4

### 3. large-format-display-preview.jpg
- **Source:** Screenshot from LFD_WX_1080p.mp4
- **Recommended size:** 1920x1080px (16:9 aspect ratio)
- **Description:** Large format display interface preview
- **Video:** LFD_WX_1080p.mp4

### 4. tablet-interface-preview.jpg
- **Source:** Screenshot from TabletScreen720P.mp4
- **Recommended size:** 1280x720px (16:9 aspect ratio)
- **Description:** Tablet interface preview
- **Video:** TabletScreen720P.mp4

## Image Guidelines

- **Format:** JPG (JPEG) for best web compatibility
- **Aspect Ratio:** 16:9 (maintains consistency across all video cards)
- **Quality:** 80-85% JPEG quality for balance between file size and clarity
- **File Size:** Target under 200KB per image
- **Naming:** Use kebab-case (lowercase with hyphens)

## Usage

These images are referenced in `index.html` as video poster attributes:

```html
<video controls poster="assets/previews/anatomy-reference-preview.jpg">
    <source src="assets/AnatomyReference.m4v" type="video/mp4">
</video>
```

The browser will display the poster image:
- Before the video is played
- While the video is loading
- As a fallback if the video fails to load
