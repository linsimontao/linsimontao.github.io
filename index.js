mapboxgl.accessToken = 'pk.eyJ1IjoiZmx5bG92ZXlpbiIsImEiOiJjamxrbDdwYzEwbnRkM3Bvc2FrNXJkdnBqIn0.BcLOSxmkqBsdtirv1YtYVw';
const start = [103.853053, 1.293146];
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/flyloveyin/cktxsypao0ach17qsaiw1l1eb',
    center: start,
    zoom: 15.5,
    bearing: 27,
    pitch: 20
});

fetch(`people.json`)
    .then(res => res.json())
    .then(json => {
        const people = json.features;
        const divFeature = document.getElementById('features');
        const popup = new mapboxgl.Popup({ offset: [0, -50], closeOnClick: false, closeButton: false })
        people.map((p, i) => {
            const section = document.createElement('section');
            section.id = p.properties.name;
            if(i === 0) {
                section.classList.add("active");
                popup.setLngLat(p.geometry.coordinates)
                .setHTML(`
                    <img src=${p.properties.pic.location} width="200px">
                `)
                .addTo(map);
            }
            const h3 = document.createElement('h1');
            h3.innerText = '\n' + p.properties.name;
            section.appendChild(h3);

            const para = document.createElement('p');
            para.innerText = p.properties.words;
            section.appendChild(para);

            if (p.properties.pic.person) {
                const img = document.createElement('img');
                img.src = p.properties.pic.person;
                section.appendChild(img);    
            }
            
            divFeature.appendChild(section);
        });

        let activeName = 'Joan';
        function setActive(person) {
            if (person.properties.name === activeName) return;
            if (person.properties.pic.location) {
                popup.setLngLat(person.geometry.coordinates)
                .setHTML(`
                    <img src=${person.properties.pic.location} width="200px">
                `)
                .addTo(map);
            }
            map.flyTo({ center: person.properties.settings.center, zoom: person.properties.settings.zoom, essential: true },);
            document.getElementById(person.properties.name).classList.add('active');
            document.getElementById(activeName).classList.remove('active');

            activeName = person.properties.name;
        }

        function isElementOnScreen(person) {
            const element = document.getElementById(person.properties.name);
            const bounds = element.getBoundingClientRect();
            return bounds.top < window.innerHeight && bounds.bottom > 0;
        }

        // On every scroll event, check which element is on screen
        window.onscroll = () => {
            const active = people.filter(isElementOnScreen);
            if (active.length > 0) {
                setActive(active[0]);
            }
        };
    });

