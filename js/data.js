---
layout: null
---

var data = {};

{% assign projects = site.projects | sort:"position" %}

{% for project in projects %}
  {% for collection in site.collections %}
    {% if collection.label == project.slug %}
      data['{{ collection.label }}'] = [];
      {% assign articles = collection.docs | sort:"position" %}
      {% for article in articles %}
        {% if article.audio_file %}
          data['{{ collection.label }}'].push(
            {
              file: "{{ article.audio_file }}",
              title: "{{ article.title }}",
              coords: "{{ article.coords }}",
              article: "{{ article.slug }}"
            }
          )
        {% elsif article.locations %}
          {% for location in article.locations %}
            data['{{ collection.label }}'].push(
              {
                file: "{{ location.audio_file }}",
                title: "{{ location.title }}",
                coords: "{{ location.coords }}",
                article: "{{ article.slug }}"
              }
            )
          {% endfor %}
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endfor %}
{% endfor %}

console.log("Lutter App Data", data);
