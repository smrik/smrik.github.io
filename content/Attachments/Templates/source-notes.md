---
type: {% if itemType == "book" %}
    - book{% else %}
    - paper{% endif %}
title: "{% if creators and creators.length %}{{ creators[0].lastName }}{% if creators.length == 2 %} & {{ creators[1].lastName }}{% elseif creators.length > 2 %} et al.{% endif %}{% endif %}{% if date %} ({{ date | format('YYYY') }}){% endif %} — {{ shortTitle or title }}"
year: "{% if date %}{{ date | format('YYYY') }}{% endif %}"
authors:
{% if creators and creators.length %}
{% for c in creators %}
  - "{{ c.lastName }}{% if c.firstName %}, {{ c.firstName }}{% endif %}"
{% endfor %}
{% else %}
  - ""
{% endif %}
citekey: "{{ citekey }}"
zotero_select: "{{ select }}"
created: "{{ importDate | format('YYYY-MM-DD') }}"
modified: "{{ importDate | format('YYYY-MM-DD') }}"
tags: [{% for t in tags %}{{t.tag}}{% if not loop.last %}, {% endif %}{% endfor %}]
---


# {{title}}

Zotero PDF Link: {{pdfZoteroLink}}
Related:: {% for relation in relations | selectattr("citekey") %} [[{{relation.citekey}}]]{% if not loop.last %}, {% endif%} {% endfor %}

### Persistent Notes
{% persist "notes" %}{% if isFirstImport %}
Write notes here!
{% endif %}
{% endpersist %}

### In-text annotations

{% for annotation in annotations -%}
{%- if annotation.annotatedText -%}
{% if annotation.color %} <mark class="hltr-{{annotation.colorCategory | lower}}">"{{annotation.annotatedText | safe}}"</mark> {% else %} {{annotation.type | capitalize}} {% endif %}[Page {{annotation.pageLabel}}](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.pageLabel}}&annotation={{annotation.id}})
{%- endif %}
{% if annotation.comment %}
{{annotation.comment | safe}} [Page {{annotation.pageLabel}}](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.pageLabel}}&annotation={{annotation.id}})
{% endif %}
{%- if annotation.imageRelativePath %} 
![[{{annotation.imageRelativePath}}]]
{%- endif %}
{% if annotation.allTags %}
{{annotation.allTags}}
{% endif %}
{% endfor -%}