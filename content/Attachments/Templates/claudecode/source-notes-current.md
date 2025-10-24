---
type: {% if itemType == "book" %}book{% else %}paper{% endif %}
title: "{% if creators and creators.length %}{{ creators[0].lastName }}{% if creators.length == 2 %} & {{ creators[1].lastName }}{% elseif creators.length > 2 %} et al.{% endif %}{% endif %}{% if date %} ({{ date | format('YYYY') }}){% endif %} — {{ shortTitle or title }}"
year: {% if date %}{{ date | format('YYYY') }}{% endif %}
authors:
{% if creators and creators.length %}
{% for c in creators %}
  - "{{ c.lastName }}{% if c.firstName %}, {{ c.firstName }}{% endif %}"
{% endfor %}
{% else %}
  - ""
{% endif %}
citekey: "{{ citekey }}"
zotero_link: "{{ select }}"
created: "{{ importDate | format('YYYY-MM-DD') }}"
modified: "{{ importDate | format('YYYY-MM-DD') }}"
---

# {{ title }}

**Zotero Link:** {{ select }}
**PDF:** {{ pdfZoteroLink }}
{% if relations %}**Related:** {% for relation in relations %}{% if relation.citekey %}[[{{ relation.citekey }}]]{% if not loop.last %}, {% endif %}{% endif %}{% endfor %}{% endif %}

{% persist "permanent_notes" %}{% if isFirstImport %}
## Permanent Notes

Write permanent notes here that will survive re-imports.

{% endif %}{% endpersist %}

{% persist "synthesis_notes" %}
## Synthesis Notes

Add synthesis notes here between annotation sections.

{% endpersist %}

## Annotations

{# Yellow - Main Idea #}
{% set yellowFound = false %}
{% for annotation in annotations -%}
{%- if (annotation.color == "#ffd400" or annotation.colorCategory == "Yellow") and (annotation.annotatedText or annotation.comment or annotation.imageRelativePath) -%}
{%- if not yellowFound %}
{% set yellowFound = true %}

### Main Idea
{% endif -%}
**Page {{annotation.pageLabel}}** — [Open annotation](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.pageLabel}}&annotation={{annotation.id}})
{%- if annotation.annotatedText %}
{{annotation.annotatedText}}
{%- endif %}
{%- if annotation.imageRelativePath %}
![[{{annotation.imageRelativePath}}]]
{%- endif %}
{%- if annotation.comment %}
_Note:_ {{annotation.comment}}
{%- endif %}
{%- if annotation.allTags %}
_Tags:_ {{annotation.allTags}}
{%- endif %}
{%- endif %}
{%- endfor %}

{# Blue - TODO / Follow-up #}
{% set blueFound = false %}
{% for annotation in annotations -%}
{%- if (annotation.color == "#2ea8e5" or annotation.colorCategory == "Blue") and (annotation.annotatedText or annotation.comment or annotation.imageRelativePath) -%}
{%- if not blueFound %}
{% set blueFound = true %}

### TODO / Follow-up
{% endif -%}
**Page {{annotation.pageLabel}}** — [Open annotation](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.pageLabel}}&annotation={{annotation.id}})
{%- if annotation.annotatedText %}
{{annotation.annotatedText}}
{%- endif %}
{%- if annotation.imageRelativePath %}
![[{{annotation.imageRelativePath}}]]
{%- endif %}
{%- if annotation.comment %}
_Note:_ {{annotation.comment}}
{%- endif %}
{%- if annotation.allTags %}
_Tags:_ {{annotation.allTags}}
{%- endif %}
{%- endif %}
{%- endfor %}


{# Green - Definition / Method #}
{% set greenFound = false %}
{% for annotation in annotations -%}
{%- if (annotation.color == "#5fb236" or annotation.colorCategory == "Green") and (annotation.annotatedText or annotation.comment or annotation.imageRelativePath) -%}
{%- if not greenFound %}
{% set greenFound = true %}

### Definition / Method
{% endif -%}
**Page {{annotation.pageLabel}}** — [Open annotation](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.pageLabel}}&annotation={{annotation.id}})
{%- if annotation.annotatedText %}
{{annotation.annotatedText}}
{%- endif %}
{%- if annotation.imageRelativePath %}
![[{{annotation.imageRelativePath}}]]
{%- endif %}
{%- if annotation.comment %}
_Note:_ {{annotation.comment}}
{%- endif %}
{%- if annotation.allTags %}
_Tags:_ {{annotation.allTags}}
{%- endif %}
{%- endif %}
{%- endfor %}

{# Purple - Example / Worked Solution #}
{% set purpleFound = false %}
{% for annotation in annotations -%}
{%- if (annotation.color == "#a28ae5" or annotation.colorCategory == "Purple") and (annotation.annotatedText or annotation.comment or annotation.imageRelativePath) -%}
{%- if not purpleFound %}
{% set purpleFound = true %}

### Example / Worked Solution
{% endif -%}
**Page {{annotation.pageLabel}}** — [Open annotation](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.pageLabel}}&annotation={{annotation.id}})
{%- if annotation.annotatedText %}
{{annotation.annotatedText}}
{%- endif %}
{%- if annotation.imageRelativePath %}
![[{{annotation.imageRelativePath}}]]
{%- endif %}
{%- if annotation.comment %}
_Note:_ {{annotation.comment}}
{%- endif %}
{%- if annotation.allTags %}
_Tags:_ {{annotation.allTags}}
{%- endif %}
{%- endif %}
{%- endfor %}

{# Red - Critique / Limitations #}
{% set redFound = false %}
{% for annotation in annotations -%}
{%- if (annotation.color == "#ff6666" or annotation.colorCategory == "Red") and (annotation.annotatedText or annotation.comment or annotation.imageRelativePath) -%}
{%- if not redFound %}
{% set redFound = true %}

### Critique / Limitations
{% endif -%}
**Page {{annotation.pageLabel}}** — [Open annotation](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.pageLabel}}&annotation={{annotation.id}})
{%- if annotation.annotatedText %}
{{annotation.annotatedText}}
{%- endif %}
{%- if annotation.imageRelativePath %}
![[{{annotation.imageRelativePath}}]]
{%- endif %}
{%- if annotation.comment %}
_Note:_ {{annotation.comment}}
{%- endif %}
{%- if annotation.allTags %}
_Tags:_ {{annotation.allTags}}
{%- endif %}
{%- endif %}
{%- endfor %}

{# Orange - Read / Citation #}
{% set orangeFound = false %}
{% for annotation in annotations -%}
{%- if (annotation.color == "#f19837" or annotation.colorCategory == "Orange") and (annotation.annotatedText or annotation.comment or annotation.imageRelativePath) -%}
{%- if not orangeFound %}
{% set orangeFound = true %}

### Read / Citation
{% endif -%}
**Page {{annotation.pageLabel}}** — [Open annotation](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.pageLabel}}&annotation={{annotation.id}})
{%- if annotation.annotatedText %}
{{annotation.annotatedText}}
{%- endif %}
{%- if annotation.imageRelativePath %}
![[{{annotation.imageRelativePath}}]]
{%- endif %}
{%- if annotation.comment %}
_Note:_ {{annotation.comment}}
{%- endif %}
{%- if annotation.allTags %}
_Tags:_ {{annotation.allTags}}
{%- endif %}

{%- endif %}
{%- endfor %}

{# Grey - Miscellaneous #}
{% set greyFound = false %}
{% for annotation in annotations -%}
{%- if (annotation.color == "#aaaaaa" or annotation.colorCategory == "Grey") and (annotation.annotatedText or annotation.comment or annotation.imageRelativePath) -%}
{%- if not greyFound %}
{% set greyFound = true %}

### Miscellaneous
{% endif -%}
**Page {{annotation.pageLabel}}** — [Open annotation](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.pageLabel}}&annotation={{annotation.id}})
{%- if annotation.annotatedText %}
{{annotation.annotatedText}}
{%- endif %}
{%- if annotation.imageRelativePath %}
![[{{annotation.imageRelativePath}}]]
{%- endif %}
{%- if annotation.comment %}
_Note:_ {{annotation.comment}}
{%- endif %}
{%- if annotation.allTags %}
_Tags:_ {{annotation.allTags}}
{%- endif %}
{%- endif %}
{%- endfor %}

{% persist "endnotes" %}

## Endnotes

Add final notes, conclusions, or references here.

{% endpersist %}

{# Debug information #}
<!-- Processed {{ annotations.length }} annotations across {{ colorOrder.length }} color categories -->