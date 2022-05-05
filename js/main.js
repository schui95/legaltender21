let adoptions = {
    "El Salvador": {rank: 1, blockheight: 686380, source: "https://www.bbc.com/news/world-latin-america-57398274"}, 
    "Central African Rep.": {rank: 2, blockheight: 733777, source: "https://www.bbc.com/news/world-africa-61248809"},
    "Panama": {source: "https://fortune.com/2022/04/29/panama-legalize-use-bitcoin-cryptocurrencies-legal-tender/"}
}

fetch("https://raw.githubusercontent.com/schui95/legaltender21/main/resources/countries.json").then((r) => r.json()).then((data) => {
    let countries = ChartGeo.topojson.feature(data, data.objects.countries).features;
    new Chart(document.getElementById("canvas").getContext("2d"), {
        type: "choropleth",
        data: {
            labels: countries.map((c) => c.properties.name),
            datasets: [{
                label: "Countries",
                data: countries.map((c) => ({feature: c, value: (c.properties.name in adoptions)? adoptions[c.properties.name].blockheight:-1})),
                backgroundColor: countries.map((c) => (c.properties.name in adoptions)? (adoptions[c.properties.name].rank)? "#F2A900": pattern.draw("diagonal", "#282828", "#739DFF", 6) : "#282828")
            }]
        },
        options: {
            showOutline: false,
            showGraticule: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    bodyFont: {
                        size: 13
                    },
                    bodySpacing: 4,
                    borderWidth: 1,
                    borderColor: "#D3D3D3",
                    callbacks: {
                        label: function(context) {
                            let country = context.element.feature.properties.name;
                            if (country in adoptions && adoptions[country].rank) {
                                return `${country} #${adoptions[country].rank}`;
                            }
                            return country;
                        },
                        afterBody: function(context) {
                            let country = context[0].element.feature.properties.name;
                            if (country in adoptions && adoptions[country].blockheight) {
                                return `Block Height: ${adoptions[country].blockheight}`;
                            }
                            return "";
                        }
                    }   
                }
            },
            scales: {
                xy: {
                    projection: "equalEarth"
                },
                color: {
                    display: false
                } 
            },
            onClick: (evt, elems) => {
                if (elems.length < 1) {
                    return null;
                }
                let country = elems[0].element.feature.properties.name;
                (country in adoptions)? window.open(adoptions[country].source): window.open("https://brrr.money/");
            }
        }
    });
}); 