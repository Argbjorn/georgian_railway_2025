import { map } from "./map.js";

const options = {
  poiOptions: {
    iconShape: "marker",
    icon: "question",
    borderColor: "#020887",
    textColor: "#020887",
    borderWidth: 2,
  }
};

export const poiInfo = [
    {
        description_ru: "Абхазская железная дорога на сегодняшний день не соединена с Грузинской железной дорогой. После станции Очамчире рельсы разобраны, никакой инфраструктуры нет. Однако, пассажирское сообщение в Абхазии существует: поезда ходят до Сухуми со стороны России. Например, действуют поезда из Москвы и Санкт-Петербурга. Их расписание не сложно найти в интернете, на этом сайте о них не рассказывается.",
        description_en: "Abkhazian railway is not connected to the Georgian railway. After the Ochamchire station, the rails are dismantled, there is no infrastructure. However, passenger communication in Abkhazia exists: trains run to Sukhumi from Russia. For example, there are trains from Moscow and St. Petersburg. Their schedule is not difficult to find online, this site does not talk about them.",
        description_ka: "აფხაზეთის რკინიგზა დღესდღეობით არ უკავშირდება საქართველოს რკინიგზას. ოჩამჩირის სადგურის შემდეგ რელსები დაშლილია, ინფრასტრუქტურა არ არსებობს. თუმცა, აფხაზეთში სამგზავრო მიმოსვლა არსებობს: მატარებლები დადიან სოხუმამდე რუსეთის მხრიდან. მაგალითად, მოქმედებს მატარებლები მოსკოვიდან და სანკტ-პეტერბურგიდან. მათი განრიგის მოძიება ინტერნეტში არ არის რთული, ამ საიტზე მათ შესახებ არაფერია ნათქვამი.",
        coords: [42.7732, 41.3948],
    },
    {
        description_ru: "Пассажирские поезда в Ткибули не ходят как минимум с 2023 года. До города можно добраться на маршрутке.",
        description_en: "Passenger trains in Tkibuli do not run as of 2023. To the city you can get by bus.",
        description_ka: "სამგზავრო მატარებლები ტყიბულში არ დადიან სულ მცირე 2023 წლიდან. ქალაქამდე შეგიძლიათ მიხვიდეთ მარშრუტკით.",
        coords: [42.33774, 42.98264],
    },
    {
        description_ru: "Пассажирские поезда в Кахетию не ходят с 2007 года. Новостей о планах возобновления пассажирских перевозок пока нет.",
        description_en: "Passenger trains in Kakheti do not run since 2007. There are no news about plans to resume passenger transportation.",
        description_ka: "სამგზავრო მატარებლები კახეთში არ დადიან 2007 წლიდან. სამგზავრო გადაზიდვების განახლების გეგმების შესახებ ჯერჯერობით სიახლეები არ არის.",
        coords: [41.6467, 45.6118],
    },
    {
        description_ru: "Крайняя точка для пассажирских поездов на этой ветке - Боржоми. В сторону Ахалцихе поезда не ходят с 2010 года.",
        description_en: "The farthest point for passenger trains on this branch is Borjomi. Passenger trains to Akhaltsikhe do not run since 2010.",
        description_ka: "მგზავრული მატარებლებისთვის ამ ხაზზე საბოლოო წერტილია ბორჯომი. ახალციხის მიმართულებით მატარებლები 2010 წლიდან აღარ მოძრაობენ.",
        coords: [41.69444, 43.11855],
    }
]

export class Poi {
  constructor(description, coords) {
    this.description = description,
    this.coords = coords,
    this.marker = L.marker(this.coords).bindPopup(this.description),
    this.marker.setIcon(L.BeautifyIcon.icon(options.poiOptions));
    this.show();
  }

  show() {
    this.marker.addTo(map);
  }

  hide() {
    this.marker.remove();
  }
}
