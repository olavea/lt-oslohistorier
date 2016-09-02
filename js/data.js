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
        {% if article.audio_file %}
          {% assign coords = article.coords | split:"," %}
          lutterAppData['{{ collection.label }}'].push(
            {
              title: "{{ article.title }}",
              lat: {{ coords[0] | default: 0 }},
              lng: {{ coords[1] | default: 0 }},
              projectId: "{{ collection.label }}",
              articleId: "{{ article.slug }}",
              position: "{{ article.position }}"
            }
          )
        {% elsif article.locations %}
          {% for location in article.locations %}
            {% assign coords = location.coords | split:"," %}
            lutterAppData['{{ collection.label }}'].push(
              {
                title: "{{ location.title }}",
                lat: {{ coords[0] | default: 0 }},
                lng: {{ coords[1] | default: 0 }},
                projectId: "{{ collection.label }}",
                articleId: "{{ article.slug }}",
                position: "{{ article.position }}"
              }
            )
          {% endfor %}
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endfor %}
{% endfor %}

console.log("Lutter App Data", lutterAppData);