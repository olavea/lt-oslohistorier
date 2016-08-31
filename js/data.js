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
              file: "{{ article.audio_file }}",
              title: "{{ article.title }}",
              lat: {{ coords[0] }},
              lng: {{ coords[1] }},
              article: "{{ article.slug }}"
            }
          )
        {% elsif article.locations %}
          {% for location in article.locations %}
            {% assign coords = location.coords | split:"," %}
            lutterAppData['{{ collection.label }}'].push(
              {
                file: "{{ location.audio_file }}",
                title: "{{ location.title }}",
                lat: {{ coords[0] }},
                lng: {{ coords[1] }},
                article: "{{ article.slug }}"
              }
            )
          {% endfor %}
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endfor %}
{% endfor %}

console.log("Lutter App Data", lutterAppData);
