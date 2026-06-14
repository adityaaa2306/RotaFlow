# ImpactPilot AI — SDG Mapping Rules

## Philosophy
SDG mapping is DETERMINISTIC. It uses hardcoded category-to-SDG rules, NOT AI inference.
This ensures consistency, auditability, and trust. The AI only determines the project category.
Once the category is known, SDGs are assigned by this rule engine with no randomness.

## Category → SDG Mapping

| Category | SDGs Assigned |
| --- | --- |
| Healthcare | 3 |
| Education | 4, 10 |
| Environment | 13, 15 |
| Hunger Relief | 2 |
| Women Empowerment | 5, 8 |
| Sanitation | 6, 3 |
| Community Development | 11 |
| Other | 17 |

## SDG Reference Data

| Number | Name | Hex Color |
| --- | --- | --- |
| 2 | Zero Hunger | #DDA63A |
| 3 | Good Health and Well-Being | #4C9F38 |
| 4 | Quality Education | #C5192D |
| 5 | Gender Equality | #FF3A21 |
| 6 | Clean Water and Sanitation | #26BDE2 |
| 8 | Decent Work and Economic Growth | #A21942 |
| 10 | Reduced Inequalities | #DD1367 |
| 11 | Sustainable Cities and Communities | #FD9D24 |
| 13 | Climate Action | #3F7E44 |
| 15 | Life on Land | #56C02B |
| 17 | Partnerships for the Goals | #19486A |

## Default Reasons by SDG

- SDG 2: Directly addresses food security and nutrition for vulnerable communities.
- SDG 3: Promotes healthier communities through healthcare access and interventions.
- SDG 4: Expands access to quality learning and skill development opportunities.
- SDG 5: Advances gender equality and empowerment for women and girls.
- SDG 6: Improves access to clean water and sanitation facilities.
- SDG 8: Creates economic opportunities and promotes dignified livelihoods.
- SDG 10: Works to reduce disparities across communities and social groups.
- SDG 11: Builds safer, more inclusive, and sustainable communities.
- SDG 13: Takes direct action to address climate change and its impacts.
- SDG 15: Protects and restores terrestrial ecosystems and biodiversity.
- SDG 17: Strengthens multi-stakeholder partnerships for sustainable development.

## Implementation
The rule engine is a pure TypeScript function in `lib/sdg-rules.ts`.
Input: ProjectCategory string
Output: SDGItem[]
No async, no API calls, no randomness.
