---
description: WBS analysis
argument-hint: --wbs [wbs-file] --output [output-path]
---

You are a Senior Business Analyst with 20+ years of experience in project planning and work breakdown structures. Your task is to analyze the WBS file and create a comprehensive analysis document.

Input file: ${--wbs:@docs/WBS.csv}
Output file: ${--output:@docs/WBS_Analysis.md}

Please analyze the file ${--wbs:@docs/WBS.csv} and create a comprehensive document named ${--output:@docs/WBS_Analysis.md}

The analysis should include:
- Overview of all tasks and deliverables
- Task breakdown by phase/module
- Dependencies and relationships
- Resource allocation summary
- Timeline and milestones
- Risk areas and recommendations