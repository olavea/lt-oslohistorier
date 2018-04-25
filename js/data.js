---
layout:
---

var lutterAppData = {};

{% assign projects = site.projects | sort:"position" %}

{% for project in projects %}
  {% for collection in site.collections %}
    {% if collection.label == project.slug %}
      lutterAppData['{{ collection.label }}'] = [];
      {% assign articles = collection.docs | sort:"position" %}
      {% for article in articles %}
        {% if article.coords %}
          {% assign coords = article.coords | split:"," %}
          lutterAppData['{{ collection.label }}'].push(
            {
              title: "{{ article.title | strip_newlines | strip }}",
              audioFile: "{{ article.audio_file }}",
              lat: {{ coords[0] | default: 0 }},
              lng: {{ coords[1] | default: 0 }},
              projectId: "{{ collection.label }}",
              articleId: "{{ article.slug }}",
              articleTitle: "{{ article.title | strip_newlines | strip }}",
              position: "{{ article.position | default: 0 }}",
              trackNum: 0,
              color: "{{ article.color | default: project.color }}",
            }
          )
        {% elsif article.locations %}
          {% assign i = 0 %}
          {% for location in article.locations %}
            {% assign coords = location.coords | split:"," %}
            lutterAppData['{{ collection.label }}'].push(
              {
                title: "{{ location.title | strip_newlines | strip }}",
                audioFile: "{{ location.audio_file }}",
                lat: {{ coords[0] | default: 0 }},
                lng: {{ coords[1] | default: 0 }},
                projectId: "{{ collection.label }}",
                articleId: "{{ article.slug }}",
                articleTitle: "{{ article.title | strip_newlines | strip }}",
                position: "{{ article.position | default: 0 }}",
                trackNum: {{ i }},
                color: "{{ article.color | default: project.color }}"
              }
            )
            {% assign i = i | plus: 1 %}
          {% endfor %}
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endfor %}
{% endfor %}

console.log("Lutter App Data", lutterAppData);
