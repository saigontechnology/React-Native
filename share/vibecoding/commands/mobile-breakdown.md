---
description: Guide mobile with design
argument-hint: --input [guide-path] --output [output-dir]
---

Base on ${--input:@docs/Mobile_implementation_guide.md} break down each session into separate md file under ${--output:documents/mobile}

Create the following structure:
1. **TechStack.md** - Technology stack and project structure overview
2. **[FeatureName].md** - One file per feature with:
   - User Story
   - Figma Design (with Figma links)
   - Screenshots/Images
   - Implementation Details
   - Screen Flow (navigation diagram)
   - Component List
   - State Management Requirements
   - API Integration Points

Each feature file should follow this template:

# Feature: [Name]

## User Story
[User story description]

## Figma Design
[Figma link and design notes]

## Screenshots
![Screenshot](path/to/image.png)

## Implementation Details
- Components needed
- Props and state structure
- Business logic requirements

## Screen Flow
[Navigation flow between screens]

## API Integration
- Required endpoints
- Data transformation logic

DO NOT include any code samples
Focus on providing clear specifications for each feature