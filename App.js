import React, { useState, useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
  Alert,
  Share,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Question pool - 132 questions across 5 categories (GECORRIGEERD 31-01-2026)
const questionPool = {
  plekken: [
    { question: 'Wat is het oudste nog bestaande gebouw van Rotterdam?', options: ["Het Witte Huis", "Hotel New York", "Het Stadhuis", "De Laurenskerk"], correct: 3, fact: 'De Laurenskerk is het enige middeleeuwse gebouw dat het bombardement overleefde.' },
    { question: 'Welke architect ontwierp de Kubuswoningen?', options: ["Rem Koolhaas", "Piet Blom", "Ben van Berkel", "Herman Hertzberger"], correct: 1, fact: 'Piet Blom ontwierp de Kubuswoningen in de jaren \'70.' },
    { question: 'Welke brug uit 1996 wordt \'De Zwaan\' genoemd?', options: ["Willemsbrug", "Van Brienenoordbrug", "Erasmusbrug", "Calandbrug"], correct: 2, fact: 'De vorm van de Erasmusbrug leverde deze bijnaam op.' },
    { question: 'Welke brug uit 1981 luidde de vernieuwing tussen Noord en Zuid in?', options: ["De Hef", "Erasmusbrug", "Willemsbrug", "Maastunnel"], correct: 2, fact: 'De Willemsbrug was de eerste moderne oeververbinding.' },
    { question: 'Welk gebouw staat op de UNESCO Werelderfgoedlijst?', options: ["Markthal", "Euromast", "Van Nellefabriek", "Witte Huis"], correct: 2, fact: 'De Van Nellefabriek staat sinds 2014 op de UNESCO-lijst.' },
    { question: 'Wat was de eerste autovrije winkelstraat van Europa?', options: ["Meent", "Coolsingel", "Lijnbaan", "Beursplein"], correct: 2, fact: 'De Lijnbaan opende in 1953.' },
    { question: 'Welke toren werd gebouwd voor de Floriade van 1960?', options: ["Euromast", "Maastoren", "Montevideo", "Zalmhaventoren"], correct: 0, fact: 'De Euromast was uitkijktoren voor de Floriade.' },
    { question: 'Hoe heet het kunstwerk aan het plafond van de Markthal?', options: ["Marktleven", "Kleuren van de Maas", "Hoorn des Overvloeds", "De Rotterdamse lucht"], correct: 2, fact: 'Een gigantische digitale print van Arno Coenen.' },
    { question: 'Hoe heet het spiegelende kunstdepot in het Museumpark?', options: ["Kunsthal", "Depot Boijmans Van Beuningen", "Boijmans Museum", "Het Depot"], correct: 1, fact: 'Het depot is volledig toegankelijk voor publiek.' },
    { question: 'Hoe heet het grote gebouwencomplex van Rem Koolhaas aan de Maas?', options: ["Montevideo", "Maastoren", "De Rotterdam", "New Orleans"], correct: 2, fact: 'Ontworpen door OMA van Rem Koolhaas.' },
    { question: 'In welk stadsdeel bleef historische bebouwing gespaard bij het bombardement?', options: ["Kralingen", "Delfshaven", "Feijenoord", "Overschie"], correct: 1, fact: 'Delfshaven bleef grotendeels intact.' },
    { question: 'Wat is de Koopgoot?', options: ["Een gracht", "Een markt", "Een metrostation", "Een ondergrondse winkelstraat"], correct: 3, fact: 'De officiële naam is Beurstraverse.' },
    { question: 'Welke wijk wordt ook wel \'De Kaap\' genoemd?', options: ["Kralingen", "Charlois", "Katendrecht", "Feijenoord"], correct: 2, fact: 'Katendrecht was vroeger berucht, maar is nu een van de hipste wijken van Rotterdam.' },
    { question: 'Welk park ligt aan de voet van de Euromast?', options: ["Kralingse Bos", "Zuiderpark", "Het Park", "Vroesenpark"], correct: 2, fact: 'Het Park werd aangelegd in 1852 en is het oudste stadspark van Rotterdam.' },
    { question: 'Hoe heette de voetgangersbrug die Rotterdam-Noord verbond met het centrum?', options: ["Erasmusbrug", "Koninginnebrug", "Willemsbrug", "Luchtsingel"], correct: 3, fact: 'De Luchtsingel was 390 meter lang en werd gefinancierd door crowdfunding. De houten brug is gesloopt in 2024.' },
    { question: 'Waar vind je de Fenix Food Factory?', options: ["Markthal", "Katendrecht", "Kop van Zuid", "Oude Haven"], correct: 1, fact: 'De Fenix Food Factory zit in een voormalige loods van de Holland-Amerika Lijn.' },
    { question: 'Welke straat staat bekend om zijn uitgaansleven en restaurants?', options: ["Coolsingel", "Lijnbaan", "Witte de Withstraat", "Meent"], correct: 2, fact: 'De Witte de Withstraat is vernoemd naar een Nederlandse zeeheld uit de 17e eeuw.' },
    { question: 'Welke toren staat naast Rotterdam Centraal?', options: ["Delftse Poort", "Millennium Tower", "Maastoren", "First Rotterdam"], correct: 0, fact: 'De Delftse Poort was tot 2009 het hoogste gebouw van Nederland met 151 meter.' },
    { question: 'Hoe heet het grootste winkelcentrum in Rotterdam-Zuid?', options: ["Zuidplein", "Alexandrium", "Keizerswaard", "Beverwaard"], correct: 0, fact: 'Winkelcentrum Zuidplein is een van de grootste winkelcentra van Nederland.' },
    { question: 'Hoe heet de historische spoorbrug die een monument is?', options: ["De Hef", "De Zwaan", "De Willemsbrug", "De Koninginnebrug"], correct: 0, fact: 'De Hef (Koningshavenbrug) is een hefbrug uit 1927 en is nu een monument.' },
    { question: 'Waar vind je de bekende Laurenskerk?', options: ["Coolsingel", "Blaak", "Oude Haven", "Grotekerkplein"], correct: 3, fact: 'De Laurenskerk is het enige middeleeuwse bouwwerk dat het bombardement overleefde.' },
    { question: 'Welk theater staat aan de Wilhelminapier?', options: ["Rotterdamse Schouwburg", "Luxor Theater", "Theater Rotterdam", "Nieuwe Luxor"], correct: 3, fact: 'Het Nieuwe Luxor opende in 2001 en is het grootste theater van Nederland.' },
    { question: 'Waar staat het Stadhuis van Rotterdam?', options: ["Blaak", "Hofplein", "Coolsingel", "Schouwburgplein"], correct: 2, fact: 'Het Stadhuis overleefde het bombardement en werd gebouwd tussen 1914-1920.' },
    { question: 'Welk paviljoen drijft op de Rijnhaven?', options: ["Floating Office", "Floating Farm", "Water Lounge", "Drijvend Paviljoen"], correct: 3, fact: 'Het Drijvend Paviljoen bestaat uit drie bollen en wordt gebruikt voor evenementen.' },
    { question: 'Welke molen staat in Delfshaven?', options: ["De Roos", "De Ster", "De Distilleerketel", "De Hoop"], correct: 2, fact: 'Korenmolen De Distilleerketel uit 1727 is nog steeds in bedrijf.' },
    { question: 'Welk hotel zit in het voormalige HAL-gebouw?', options: ["Hilton", "Marriott", "Hotel New York", "nhow"], correct: 2, fact: 'Hotel New York was het hoofdkantoor van de Holland-Amerika Lijn.' },
    { question: 'Hoe heet de dierentuin van Rotterdam?', options: ["Blijdorp", "Artis", "Diergaarde", "Ouwehands"], correct: 0, fact: 'Diergaarde Blijdorp verhuisde in 1940 van het centrum naar de huidige locatie.' },
    { question: 'Waar staat het beeld van Zadkine?', options: ["Plein 1940", "Coolsingel", "Schouwburgplein", "Hofplein"], correct: 0, fact: 'Het beeld \'De Verwoeste Stad\' herdenkt het bombardement van mei 1940.' },
    { question: 'Waar staat het beeld \'Kabouter Buttplug\' officieel?', options: ["Eendrachtsplein", "Blaak", "Coolsingel", "Museumpark"], correct: 0, fact: 'Het beeld heet officieel \'Santa Claus\' en is gemaakt door Paul McCarthy.' },
    { question: 'In welke wijk ligt Katendrecht?', options: ["Feijenoord", "Delfshaven", "Kralingen", "Overschie"], correct: 0, fact: 'Katendrecht hoort bestuurlijk bij Feijenoord.' },
    { question: 'Welke wijk ligt aan de Bergse Plassen?', options: ["Hillegersberg", "Overschie", "Prinsenland", "IJsselmonde"], correct: 0, fact: 'Hillegersberg grenst aan de Bergse Plassen.' },
    { question: 'Welke wijk grenst direct aan Schiedam?', options: ["Delfshaven", "Kralingen", "Feijenoord", "Charlois"], correct: 0, fact: 'Delfshaven ligt tegen Schiedam aan.' },
    { question: 'Waar zat viszaak Schmidt Zeevis voordat het in 2015 verhuisde naar de iconische boot aan de Matlingeweg?', options: ["Het Vasteland", "De Lijnbaan", "Markthal", "Oude Haven"], correct: 0, fact: 'Schmidt Zeevis zat vanaf 1963 tot 2015 aan het Vasteland, voordat het verhuisde naar het schip-vormige pand aan de Matlingeweg in de Spaanse Polder.' },
  ],
  geschiedenis: [
    { question: 'Welke rivier gaf Rotterdam zijn naam?', options: ["De Maas", "De Schie", "De Rijn", "De Rotte"], correct: 3, fact: 'Rotterdam ontstond bij een dam in de Rotte.' },
    { question: 'Op welke datum werd Rotterdam gebombardeerd?', options: ["10 mei 1940", "22 mei 1940", "18 mei 1940", "14 mei 1940"], correct: 3, fact: 'Op 14 mei 1940 werd het centrum verwoest.' },
    { question: 'Welke bijnaam kreeg Rotterdam direct na de oorlog?', options: ["Manhattan aan de Maas", "De Maasstad", "De havenstad", "De werkstad"], correct: 3, fact: 'Deze bijnaam verwees naar de mentaliteit van wederopbouw.' },
    { question: 'Welke bijnaam kreeg Rotterdam later door de skyline langs de Maas?', options: ["Nieuw Amsterdam", "Manhattan aan de Maas", "De torenstad", "De skyline stad"], correct: 1, fact: 'Deze bijnaam ontstond door hoogbouw en bruggen.' },
    { question: 'Welke waterweg zorgde in 1872 voor de groei van de haven?', options: ["Noordzeekanaal", "Nieuwe Maas", "Nieuwe Waterweg", "Haringvliet"], correct: 2, fact: 'De Nieuwe Waterweg gaf directe toegang tot zee.' },
    { question: 'Tot welk jaar was Rotterdam de grootste haven ter wereld?', options: ["1998", "2000", "2002", "2004"], correct: 3, fact: 'Daarna nam Shanghai deze positie over.' },
    { question: 'Hoe heet het nieuwste havengebied op opgespoten land?', options: ["Europoort", "Botlek", "Maasvlakte 2", "Waalhaven"], correct: 2, fact: 'Maasvlakte 2 werd in 2013 in gebruik genomen.' },
    { question: 'Welke organisatie beheert de haven?', options: ["Gemeente Rotterdam", "Rijkswaterstaat", "Port of Rotterdam", "Havenbedrijf Nederland"], correct: 2, fact: 'Het Havenbedrijf Rotterdam (Port of Rotterdam) beheert de haven.' },
    { question: 'Wat was de Holland-Amerika Lijn?', options: ["Een scheepvaartmaatschappij", "Een treinverbinding", "Een vliegmaatschappij", "Een busmaatschappij"], correct: 0, fact: 'Miljoenen Europeanen vertrokken via Rotterdam naar Amerika.' },
    { question: 'Welk gebouw was ooit de hoogste wolkenkrabber van Europa?', options: ["De Rotterdam", "Erasmustoren", "Het Witte Huis", "Maastoren"], correct: 2, fact: 'Het Witte Huis (1898) aan de Oude Haven was met 43 meter Europa\'s eerste \'wolkenkrabber\'.' },
    { question: 'In welk jaar werd de metro van Rotterdam geopend?', options: ["1958", "1988", "1978", "1968"], correct: 3, fact: 'Rotterdam had de eerste metro van Nederland.' },
    { question: 'Welk schip ligt permanent in de Rotterdamse haven als hotel?', options: ["SS Nieuw Amsterdam", "SS Statendam", "SS Rotterdam", "SS Volendam"], correct: 2, fact: 'De SS Rotterdam was het vlaggenschip van de Holland-Amerika Lijn.' },
    { question: 'Wanneer werd Rotterdam voor het eerst vermeld als \'Rotta\'?', options: ["789", "1028", "1270", "1340"], correct: 2, fact: 'De naam komt van een dam in de rivier de Rotte.' },
    { question: 'Wanneer kreeg Rotterdam stadsrechten?', options: ["1280", "1340", "1400", "1450"], correct: 1, fact: 'Graaf Willem IV van Holland verleende Rotterdam op 7 juni 1340 stadsrechten.' },
    { question: 'Wanneer werd de Erasmusbrug geopend?', options: ["1992", "1994", "1996", "1998"], correct: 2, fact: 'Koningin Beatrix opende de Erasmusbrug op 6 september 1996.' },
    { question: 'Hoeveel mensen kwamen om bij het bombardement van 1940?', options: ["Ongeveer 100", "Ongeveer 500", "Ongeveer 900", "Ongeveer 2000"], correct: 2, fact: 'Bij het bombardement kwamen 884 mensen om en raakten 80.000 mensen dakloos.' },
    { question: 'Wanneer werd de Euromast geopend?', options: ["1955", "1970", "1965", "1960"], correct: 3, fact: 'De Euromast werd geopend in 1960 ter gelegenheid van de Floriade.' },
    { question: 'Wanneer werd de Maastunnel geopend?', options: ["1932", "1962", "1952", "1942"], correct: 3, fact: 'De Maastunnel werd geopend in 1942 en was de eerste autotunnel onder een rivier in Europa.' },
    { question: 'Wanneer werd de Lijnbaan geopend?', options: ["1949", "1961", "1957", "1953"], correct: 3, fact: 'De Lijnbaan uit 1953 was de eerste autovrije winkelstraat van Europa.' },
    { question: 'Wanneer werd de eerste tram in Rotterdam geopend?', options: ["1879", "1899", "1919", "1939"], correct: 0, fact: 'De paardentram begon in 1879, de elektrische tram in 1905.' },
    { question: 'Wanneer werd de Van Nelle Fabriek UNESCO Werelderfgoed?', options: ["2004", "2010", "2014", "2018"], correct: 2, fact: 'In 2014 werd de Van Nelle Fabriek erkend als UNESCO Werelderfgoed.' },
    { question: 'Wanneer werd de Markthal geopend?', options: ["2012", "2016", "2014", "2018"], correct: 2, fact: 'De Markthal werd geopend op 1 oktober 2014 door Koningin Máxima.' },
    { question: 'Wat was de functie van de Van Nelle Fabriek?', options: ["Koffie/thee/tabak", "Scheepsbouw", "Textiel", "Machines"], correct: 0, fact: 'De Van Nelle Fabriek produceerde koffie, thee en tabak.' },
    { question: 'Waar stonden de tijdelijke Ahoy\'-hallen tussen 1966 en 1970?', options: ["Dijkzigt/Westzeedijk", "Feijenoord Stadion", "Waalhaven", "Heliportterrein Hofdijk/Pompenburg"], correct: 3, fact: 'Na 1966 werden de Ahoy\'-hallen tijdelijk verplaatst naar het voormalige heliportterrein in het centrum, voordat ze in 1970 definitief naar het Zuidplein verhuisden.' },
  ],
  bekende: [
    { question: 'Welke Rotterdamse zanger zong het lied \'Ik zie de haven al\'?', options: ["Gerard Cox", "Johnny Hoes", "Jaap Valkhoff", "Lee Towers"], correct: 2, fact: 'Jaap Valkhoff was een Rotterdamse volkszanger uit de jaren \'50.' },
    { question: 'Welk instrument bespeelde Jaap Valkhoff meestal?', options: ["Gitaar", "Piano", "Trompet", "Accordeon"], correct: 3, fact: 'Valkhoff trad meestal op met accordeon.' },
    { question: 'Welke Rotterdamse zanger staat bekend om \'You\'ll Never Walk Alone\' bij Feyenoord?', options: ["Gerard Cox", "Danny Vera", "Lee Towers", "Marco Borsato"], correct: 2, fact: 'Lee Towers zingt dit standaard bij huldigingen.' },
    { question: 'Welke kunstenaar maakte het beeld \'De Verwoeste Stad\'?', options: ["Karel Appel", "Ossip Zadkine", "Pablo Picasso", "Henry Moore"], correct: 1, fact: 'Het beeld herdenkt het bombardement.' },
    { question: 'Welke beroemde filosoof werd in Rotterdam geboren?', options: ["Spinoza", "Locke", "Descartes", "Erasmus"], correct: 3, fact: 'Desiderius Erasmus werd rond 1466 geboren in Rotterdam.' },
    { question: 'Welke Rotterdamse dichter stond bekend om zijn Sparta-liefde?', options: ["Jules Deelder", "Willem Barnard", "J.H. Leopold", "Louis Lehmann"], correct: 0, fact: 'Jules Deelder (1944-2019) was een icoon van Rotterdam.' },
    { question: 'Wie zong \'\'t Is weer voorbij die mooie zomer\'?', options: ["André van Duin", "Lee Towers", "Gerard Cox", "Paul de Leeuw"], correct: 2, fact: 'Gerard Cox bracht dit nummer uit in 1974.' },
    { question: 'Welke voetballer begon bij Excelsior en speelde later voor Arsenal?', options: ["Dirk Kuyt", "Pierre van Hooijdonk", "Giovanni van Bronckhorst", "Robin van Persie"], correct: 3, fact: 'Robin van Persie werd geboren in Rotterdam.' },
    { question: 'Welke schilder werd geboren in de Zaagmolenstraat in het Oude Noorden?', options: ["Piet Mondriaan", "Vincent van Gogh", "Willem de Kooning", "Karel Appel"], correct: 2, fact: 'Willem de Kooning emigreerde naar Amerika.' },
    { question: 'Welke Rotterdammer werd Eurocommissaris?', options: ["Pieter Oud", "Ahmed Aboutaleb", "Neelie Kroes", "Bram Peper"], correct: 2, fact: 'Neelie Kroes was Eurocommissaris voor Mededinging en Digitale Agenda.' },
    { question: 'Wie is de huidige burgemeester van Rotterdam?', options: ["Bram Peper", "Ahmed Aboutaleb", "Carola Schouten", "Ivo Opstelten"], correct: 2, fact: 'Carola Schouten is sinds 10 oktober 2024 burgemeester van Rotterdam.' },
    { question: 'Welke Rotterdammer was bondscoach bij het WK 1990?', options: ["Rinus Michels", "Ernst Happel", "Leo Beenhakker", "Dick Advocaat"], correct: 2, fact: 'Leo Beenhakker was geboren en getogen in Rotterdam en bekend om zijn typische Rotterdamse bluf.' },
    { question: 'Wie ontwierp de Erasmusbrug?', options: ["Ben van Berkel", "Rem Koolhaas", "Piet Blom", "Adriaan Geuze"], correct: 0, fact: 'Ben van Berkel van UNStudio ontwierp de Erasmusbrug.' },
    { question: 'Wie is de oprichter van architectenbureau OMA uit Rotterdam?', options: ["Rem Koolhaas", "Ben van Berkel", "Winy Maas", "MVRDV"], correct: 0, fact: 'Rem Koolhaas studeerde in Rotterdam en richtte OMA op.' },
    { question: 'Welke Rotterdammer was premier van Nederland?', options: ["Dries van Agt", "Wim Kok", "Ruud Lubbers", "Pieter Oud"], correct: 2, fact: 'Ruud Lubbers was het langste dienende premier in Nederlandse geschiedenis (1982-1994).' },
    { question: 'Wie is de bekendste nachtburgemeester van Rotterdam?', options: ["Jules Deelder", "Herman Brood", "Hans Teeuwen", "Freek de Jonge"], correct: 0, fact: 'Jules Deelder was jarenlang de \'onofficiële nachtburgemeester\' van Rotterdam.' },
    { question: 'Wie was de architect van de Kunsthal?', options: ["Rem Koolhaas", "Ben van Berkel", "Jo Coenen", "Piet Blom"], correct: 0, fact: 'De Kunsthal (1992) is een van de bekendste werken van Rem Koolhaas.' },
    { question: 'Wie is de bekendste chef-kok uit Rotterdam?', options: ["Herman den Blijker", "Jonnie Boer", "Ron Blaauw", "Sergio Herman"], correct: 0, fact: 'Herman den Blijker heeft meerdere restaurants in Rotterdam.' },
    { question: 'In welke film speelde Joke Bruijs de hoofdrol?', options: ["Ja Zuster, Nee Zuster", "Turks Fruit", "Soldaat van Oranje", "Flodder"], correct: 0, fact: 'Joke Bruijs (1952-2022) speelde in "Ja Zuster, Nee Zuster" (2002) en was een geliefde Rotterdamse actrice.' },
    { question: 'Welke Rotterdamse zangeres stond bekend als "De stem van Rotterdam"?', options: ["Willy Alberti", "Ria Valk", "Annie de Reuver", "Conny Stuart"], correct: 2, fact: 'Annie de Reuver (1891-1945) was een van de eerste Nederlandse schlagerzangeressen.' },
    { question: 'Welke Rotterdammer speelde vroeger met Corrie van Gorp?', options: ["André Hazes", "Lee Towers", "Gerard Cox", "André van Duin"], correct: 3, fact: 'André van Duin (1947) groeide op in Rotterdam en begon zijn carrière met Corrie van Gorp.' },
  ],
  rotterdams: [
    { question: 'Wat betekent \'bakkie pleur\'?', options: ["Een klap", "Een kopje koffie", "Een biertje", "Een koekje"], correct: 1, fact: 'Het woord \'pleur\' komt waarschijnlijk van \'pleuritis\'.' },
    { question: 'Wat bedoelt een Rotterdammer met \'Nie lulle maar poetse\'?', options: ["Niet schoonmaken", "Geen woorden maar daden", "Langzaam aan", "Niet zeuren"], correct: 1, fact: 'Dit is dé Rotterdamse mentaliteit: hard werken en geen praatjes.' },
    { question: 'Wat is een \'dooie met een dag verlof\'?', options: ["Een vrije dag", "Een begrafenis", "Een saaie persoon", "Een zieke collega"], correct: 2, fact: 'Rotterdammers staan bekend om hun directe, vaak humoristische manier van praten.' },
    { question: '\'Hij heb een snee in z\'n neus\' betekent...', options: ["Hij is gewond", "Hij is boos", "Hij is dronken", "Hij is verkouden"], correct: 2, fact: 'Het Rotterdams kent veel kleurrijke uitdrukkingen voor \'dronken zijn\'.' },
    { question: 'Hoe noemen Rotterdammers een lieveheersbeestje?', options: ["Stipbeestje", "Kapoentje", "Rooie kansen", "Geluksdiertje"], correct: 1, fact: 'Het kapoentje is een typisch Rotterdams woord.' },
    { question: 'Wat betekent \'opgepleurd\'?', options: ["Opgeruimd", "Weggegaan / vertrokken", "Ziek geworden", "Boos geworden"], correct: 1, fact: '\'Pleuren\' wordt in Rotterdam voor van alles gebruikt.' },
    { question: '\'Hebbie in je nest gezeken?\' vraagt een Rotterdammer als je...', options: ["Vroeg op bent", "Vies bent", "Laat bent", "Honger hebt"], correct: 0, fact: 'Een typisch Rotterdamse manier om te vragen waarom iemand zo vroeg wakker is.' },
    { question: 'Wat is een \'krotekoker\'?', options: ["Een rare snuiter / mafkees", "Een kookpan", "Een fiets", "Een kroeg"], correct: 0, fact: 'Jules Deelder gebruikte dit woord vaak.' },
    { question: 'Wat betekent \'nassen\'?', options: ["Rennen", "Praten", "Slapen", "Eten"], correct: 3, fact: 'Nassen is Rotterdams voor eten of vreten' },
    { question: 'Wat is een \'boterklokkie\'?', options: ["Een broodtrommel", "Een koekje", "Een gele tram", "Een duur horloge"], correct: 3, fact: 'Een boterklokkie is een duur, opzichtig horloge.' },
    { question: '\'Ben je van de pot gepleurd?\' betekent...', options: ["Ben je gevallen?", "Heb je honger?", "Ben je gek geworden?", "Ben je moe?"], correct: 2, fact: 'Deze uitdrukking gebruik je als iemand iets raars doet of zegt.' },
    { question: 'Wat betekent \'meuren\'?', options: ["Klagen", "Eten", "Werken", "Slapen / luieren"], correct: 3, fact: 'Meuren is lui in bed blijven liggen.' },
    { question: 'Wat is \'zeiken\'?', options: ["Plassen", "Klagen / zeuren", "Lachen", "Allebei A en B"], correct: 3, fact: 'Zeiken kan zowel plassen als klagen betekenen in het Rotterdams.' },
    { question: '\'Wat een pestpokkeweer\' betekent...', options: ["Verschrikkelijk weer", "Mooi weer", "Wisselvallig weer", "Warm weer"], correct: 0, fact: 'Rotterdammers gebruiken graag ziektes als versterking in hun taal.' },
    { question: 'Wat betekent \'aftaaien\'?', options: ["Weggaan", "Dansen", "Slaan", "Betalen"], correct: 0, fact: 'Aftaaien of aftansen betekent weggaan.' },
    { question: 'Wat is \'strotten\'?', options: ["Kelen", "Schreeuwen", "Eten", "Keelpijn hebben"], correct: 2, fact: 'Strotten is gulzig eten.' },
    { question: 'Wat betekent \'pitte\'?', options: ["Pitten eten", "Spugen", "Fietsen", "Slapen"], correct: 3, fact: '\'Ik ga pitte\' betekent ik ga slapen.' },
    { question: 'Wat is een \'gladjakker\'?', options: ["Een ijsbaan", "Een gladde prater/oplichter", "Een glijbaan", "Een kale man"], correct: 1, fact: 'Een gladjakker is iemand die niet te vertrouwen is.' },
    { question: '\'Loopie op je tandvlees?\' vraag je als iemand...', options: ["Uitgeput is", "Kiespijn heeft", "Hard rent", "Honger heeft"], correct: 0, fact: 'Op je tandvlees lopen betekent dat je op je laatste benen loopt.' },
    { question: 'Wat betekent \'schransen\'?', options: ["Klimmen", "Eten/vreten", "Bouwen", "Skiën"], correct: 1, fact: 'Schransen is nog een Rotterdams woord voor (veel) eten.' },
    { question: 'Hebbie een drol in je oor?\' vraag je als iemand...', options: ["Niet goed luistert", "Vies is", "Oorpijn heeft", "Raar praat"], correct: 0, fact: 'Een directe Rotterdamse manier om te vragen of iemand wel luistert.' },
    { question: 'Wat betekent \'Grote muil, dikke lip\'?', options: ["Je bent ziek", "Je bent te brutaal geweest", "Je bent aan het liegen", "Je hebt kiespijn"], correct: 1, fact: 'Dit is de Rotterdamse versie van "eigen schuld, dikke bult" - als je te veel praat, krijg je er van langs.' },
    { question: '\'Hee lange, is \'t koud bove?\' zeg je tegen...', options: ["Iemand die het koud heeft", "Een lange persoon", "Iemand op een ladder", "Een hooghartig iemand"], correct: 1, fact: 'Een typisch plaagstootje naar lange mensen in Rotterdam.' },
    { question: 'Wat betekent \'naar ze grootje\'?', options: ["Op bezoek bij oma", "Heel oud", "Kapot, stuk of doodop", "Respectvol"], correct: 2, fact: 'Als iets of iemand \'naar ze grootje\' is, dan is het compleet naar de knoppen.' },
    { question: 'Wat is \'een spetter voor je broodmole\'?', options: ["Een boterham met stroop", "Een drankje", "Een compliment", "Een klap in je gezicht"], correct: 3, fact: 'Broodmole = mond/gezicht, een spetter = een klap. Dus: een klap in je gezicht.' },
    { question: 'Wat is \'een hallefie krop\'?', options: ["Een halve kool", "Een halve wortel", "Een half brood", "Een halve liter"], correct: 2, fact: 'Een hallefie krop is Rotterdams voor een half brood. Krop komt van \'kropbrood\'.' },
    { question: 'Als een Rotterdammer zegt \'Ik ben naar de klote\', wat bedoelt hij dan?', options: ["Ik ben doodop", "Ik ben boos", "Ik ben ziek", "Ik ga weg"], correct: 0, fact: 'Dit is een krachtige manier om te zeggen dat je helemaal uitgeput bent.' },
    { question: 'Wat betekent \'Das gelope\'?', options: ["Dat is gelukt", "Dat is onmogelijk / dat gaat niet door", "Dat is weggelopen", "Dat is snel"], correct: 1, fact: 'Als iets \'gelope\' is, dan is het niet meer haalbaar of gaat het niet door.' },
    { question: '\'Gaat jij lekker effe an \'t gas\' betekent...', options: ["Ga koken", "Ga harder werken", "Donder op / ga weg", "Ga tanken"], correct: 2, fact: 'Een Rotterdamse manier om iemand te zeggen dat hij moet oprotten.' },
    { question: 'Als iemand \'zo vlug as dikke stront\' is, dan is hij...', options: ["Heel erg snel", "Heel erg dik", "Heel erg dom", "Heel erg langzaam"], correct: 3, fact: 'Een ironische uitdrukking - dikke stront beweegt helemaal niet snel, dus betekent het juist héél langzaam.' },
    { question: 'Wat is \'Roffa\'?', options: ["Een Rotterdammer", "Een Rotterdamse wijk", "Rotterdam (de stad)", "Een Rotterdamse voetbalclub"], correct: 2, fact: 'Roffa is de bijnaam voor Rotterdam, vooral gebruikt in de hiphop en straattaal.' },
    { question: 'Wat betekent \'lijp\'?', options: ["Mooi", "Gek / gestoord", "Lelijk", "Moe"], correct: 1, fact: 'Als iemand \'lijp\' is, dan is hij gek of doet hij raar.' },
    { question: '\'Da gaannie, he?\' betekent...', options: ["Dat gaat niet, hè?", "Dat gaat wel", "Ga je mee?", "Dat is mooi"], correct: 0, fact: 'Een retorische vraag om te benadrukken dat iets echt niet kan of gaat.' },
    { question: 'Wat bedoel je met \'Kommie uit Rotterdam ofso?\'', options: ["Vraag waar iemand vandaan komt", "Vraag of iemand wel echt Rotterdammer is", "Uitnodiging om naar Rotterdam te komen", "Bevestiging: ja toch, niet dan!"], correct: 3, fact: 'Dit is een retorische vraag die eigenlijk betekent "ja toch, niet dan!" - het is zo duidelijk dat je het zou moeten kunnen horen aan iemands accent.' },
    { question: '\'Ech wel! Kejje da nie hore dan?!\' gebruik je als...', options: ["Je wilt benadrukken dat iets echt waar is", "Je iemand niet verstaat", "Je iemand wilt groeten", "Je het niet eens bent"], correct: 0, fact: 'Een typisch Rotterdamse manier om te zeggen "jawel! Hoor je dat dan niet?!" - met nadruk op de waarheid.' },
    { question: 'Wat betekent "naar de gallemieze" in het Rotterdams?', options: ["Heel ver weg", "Erg duur", "Heel erg lekker", "Helemaal kapot/mis"], correct: 3, fact: 'Als iets "naar de gallemieze" is, is het helemaal kapot of mislukt.' },
    { question: 'Wat betekent "ik lach me het schompes"?', options: ["Ik lach me rot", "Ik ben verdrietig", "Ik maak een grapje", "Ik ben boos"], correct: 0, fact: 'Schompes is Rotterdams voor kapot of stuk - je lacht je dus helemaal stuk.' },
    { question: 'Wat is een "bakkie leut"?', options: ["Een glas bier", "Een kopje koffie", "Een bakje friet", "Een borreltje"], correct: 1, fact: 'Leut is een ander woord voor koffie, net als pleur.' },
    { question: '"An het gas gaan" betekent...', options: ["Gaan koken", "Oprotten/opschieten", "Gas tanken", "Gaan feesten"], correct: 1, fact: 'Als een Rotterdammer zegt dat je an het gas moet gaan, moet je opschieten of wegwezen.' },
    { question: 'Wat is een "porum"?', options: ["Een gezicht", "Een auto", "Een kroeg", "Een scheldwoord"], correct: 0, fact: '"Das geen porum" betekent: dat ziet er niet uit.' },
    { question: 'Wat betekent "lijp"?', options: ["Slim", "Gek", "Moe", "Dronken"], correct: 1, fact: 'Lijp is Rotterdams voor gek of gestoord.' },
    { question: '"Van het padje af zijn" betekent...', options: ["Verdwaald zijn", "De weg kwijt zijn/dronken", "Op vakantie zijn", "Aan het wandelen"], correct: 1, fact: 'Als je van het padje af bent, ben je dronken of weet je niet meer wat je doet.' },
    { question: 'Wat is "puinruimen"?', options: ["Opruimen na een feest", "Het zware werk doen", "Slopen", "Rommel maken"], correct: 1, fact: 'Puinruimen is het zware, ondankbare werk opknappen.' },
    { question: '"Je bek een douw geven" betekent...', options: ["Iemand slaan", "Slap of dom kletsen", "Iemand zoenen", "Je mond houden"], correct: 1, fact: 'Als je je bek een douw geeft, praat je onzin.' },
    { question: 'Wat zeg je als je tegen iemand zegt "Krijg de tering!"?', options: ["Ziek worden", "Je wijst iemand maximaal af", "Boos worden", "Honger krijgen"], correct: 1, fact: 'Dit is een van de zwaarste Nederlandse verwensingen - je wenst iemand ziekte en dood toe.' },
    { question: 'Wat betekent de uitdrukking "de Sjaak zijn"?', options: ["Een vriend", "De klos/pineut", "Een grapjas", "Een sterke kerel"], correct: 1, fact: 'Als je de sjaak bent, ben je de pineut of de klos.' },
    { question: '"Keilebakken" betekent...', options: ["Kegelen", "Stevig zuipen", "Hard werken", "Vechten"], correct: 1, fact: 'Keilebakken is Rotterdams voor stevig drinken.' },
    { question: 'Wat betekent "een zeperd halen"?', options: ["Ruzie krijgen", "Verliezen", "Iemand ophalen", "Moeten plassen"], correct: 1, fact: 'Een zeperd halen is verliezen, falen.' },
    { question: 'Wat is "peentjes zweten"?', options: ["Hard werken", "Zenuwachtig zijn", "Sporten", "In de sauna zitten"], correct: 1, fact: 'Als je peentjes zweet, ben je behoorlijk zenuwachtig.' },
    { question: '"Bekant" betekent...', options: ["Bekend", "Bijna", "Misschien", "Precies"], correct: 1, fact: 'Bekant is Rotterdams voor bijna.' },
    { question: 'Wat betekent "groos"?', options: ["Groot", "Trots", "Boos", "Dik"], correct: 1, fact: 'Groos (niet groots) is Rotterdams voor trots.' },
    { question: '"Heb ik soms met de strontemmer gerammeld?" vraag je als...', options: ["Je vies bent", "Iemand ongevraagd tegen je praat", "Je honger hebt", "Je boos bent"], correct: 1, fact: 'Een typisch Rotterdamse manier om te vragen waarom iemand je lastig valt.' },
    { question: 'Wat is een "grafwijf"?', options: ["Een weduwe", "Een rotvrouw", "Een oude vrouw", "Een begrafenisondernemer"], correct: 1, fact: 'Een grafwijf is een vervelende, nare vrouw.' },
    { question: '"Krijg nou tieten!" is een uitdrukking van...', options: ["Verbazing", "Boosheid", "Blijdschap", "Verdriet"], correct: 0, fact: 'Dit is de Rotterdamse versie van "krijg nou wat!" - pure verbazing.' },
    { question: 'Wat betekent "opgegodverredomt"?', options: ["Heel erg moe", "Wegwezen hier!", "Heel blij", "Helemaal klaar"], correct: 1, fact: 'Een krachtige Rotterdamse manier om te zeggen dat iemand moet ophoepelen.' },
    { question: '"Daluk" of "dalijk" betekent...', options: ["Duidelijk", "Straks", "Nu meteen", "Gisteren"], correct: 1, fact: 'Daluk is Rotterdams voor straks of zo meteen.' },
    { question: 'Wat betekent "holtorren"?', options: ["Hardlopen", "Jeuk aan je achterste", "Torren zoeken", "Rondhangen"], correct: 1, fact: 'Als je holtorren hebt, heb je jeuk aan je achterwerk.' },
    { question: 'Wat is een "meut"?', options: ["Een zeurderige/saaie vrouw", "Een zeurpiet", "Een meeuw", "Een vriendin"], correct: 0, fact: 'Een meut is een zeurderige of saaie vrouw.' },
    { question: 'Wat betekent "hoe is tie"?', options: ["Wie is dat?", "Hoe gaat het?", "Hoe laat is het?", "Hoe heet hij?"], correct: 1, fact: '"Hoe is tie" is de Rotterdamse begroeting voor "hoe gaat het?"' },
    { question: 'Wat betekent "azzie val, dan leggie"?', options: ["Als je valt, blijf dan liggen", "Pas op dat je niet valt", "Als je valt, dan lig je", "Val niet in slaap"], correct: 2, fact: 'Een typisch Rotterdamse dooddoener als antwoord op "wat zeg je?"' },
    { question: '"De mazzel" betekent...', options: ["Veel geluk", "Tot ziens", "De winst", "Het toeval"], correct: 1, fact: 'De mazzel is Rotterdams voor tot ziens of doei.' },
    { question: 'Wat is "een heitje voor een karweitje"?', options: ["Een kwartje voor een klusje", "Gratis werken", "Veel geld verdienen", "Zwart werken"], correct: 0, fact: 'Dit is ontstaan in Rotterdam: een heitje (kwartje) voor een klein klusje.' },
    { question: '"De reuzel loop me uit me reet" betekent...', options: ["Ik heb diarree", "Ik heb het heel warm", "Ik ben heel rijk", "Ik heb haast"], correct: 1, fact: 'Een Rotterdamse manier om te zeggen dat je het bloedheet hebt.' },
    { question: 'Wat is "een Haags bakkie"?', options: ["Een kopje thee", "Een half kopje koffie", "Een biertje", "Een beschuit"], correct: 1, fact: 'Rotterdammers pesten Hagenaars: een Haags bakkie is maar een half kopje.' },
    { question: '"Gemeente pils" is...', options: ["Goedkoop bier", "Water", "Limonade", "Jenever"], correct: 1, fact: 'Gemeente pils is Rotterdams voor een glas water.' },
    { question: 'Wat betekent "bootwerker"?', options: ["Schipper", "Iemand zonder tafelmanieren", "Havenarbeider", "Visser"], correct: 1, fact: '"Hij zit te eten als een bootwerker!" zeg je over iemand zonder tafelmanieren.' },
    { question: '"Da ken nie" betekent...', options: ["Dat ken ik niet", "Dat kan niet", "Dat is mooi", "Dat weet ik niet"], correct: 1, fact: 'Da ken nie is Rotterdams voor "dat kan niet".' },
    { question: 'Wat betekent "de hort op"?', options: ["De heuvel op", "Uitgaan", "Naar huis", "Naar het toilet"], correct: 1, fact: 'De hort op gaan is uitgaan, op stap gaan. Ontstaan in Rotterdam.' },
  ],
  feyenoord: [
    { question: 'Welke club speelt zijn thuiswedstrijden in De Kuip?', options: ["Sparta", "Excelsior", "Feyenoord", "XerxesDZB"], correct: 2, fact: 'Feyenoord speelt sinds 1937 in De Kuip.' },
    { question: 'Hoe heet de oudste voetbalclub van Nederland uit Rotterdam?', options: ["Sparta", "Feyenoord", "Excelsior", "RFC"], correct: 0, fact: 'Sparta werd opgericht in 1888.' },
    { question: 'Wanneer won Feyenoord de Europa Cup I?', options: ["1968", "1974", "1972", "1970"], correct: 3, fact: 'Op 6 mei 1970 won Feyenoord met 2-1 van Celtic in Milaan.' },
    { question: 'Hoe heet het stadion van Feyenoord officieel?', options: ["De Kuip", "Stadion Feijenoord", "Feyenoord Stadion", "Het Kasteel"], correct: 1, fact: 'De officiële naam is \'Stadion Feijenoord\'.' },
    { question: 'Welke spits had een standbeeld en een muurtje in Rotterdam?', options: ["Coen Moulijn", "Wim Jansen", "Rinus Israël", "Henk Schouten"], correct: 0, fact: 'Het Muurtje van Coen Moulijn staat in het Oude Noorden.' },
    { question: 'In welk jaar werd De Kuip geopend?', options: ["1937", "1927", "1947", "1957"], correct: 0, fact: 'De Kuip werd geopend op 27 maart 1937.' },
    { question: 'Wie scoorde de winnende goal in de Europa Cup I finale van 1970?', options: ["Wim van Hanegem", "Coen Moulijn", "Ove Kindvall", "Rinus Israël"], correct: 2, fact: 'De Zweed Ove Kindvall scoorde in de verlenging.' },
    { question: 'Wat is de bijnaam van de Feyenoord-supporters?', options: ["De Harde Kern", "De Club", "De Fanatici", "Het Legioen"], correct: 3, fact: 'Het Legioen staat bekend als een van de trouwste supportersgroepen van Nederland.' },
    { question: 'Welke Feyenoorder werd Champions League-winnaar met Barcelona?', options: ["Robin van Persie", "Dirk Kuyt", "Giovanni van Bronckhorst", "Salomon Kalou"], correct: 2, fact: 'Giovanni van Bronckhorst won in 2006 de Champions League met Barcelona.' },
    { question: 'Hoeveel landstitels heeft Feyenoord gewonnen (t/m 2024)?', options: ["13", "15", "16", "18"], correct: 2, fact: 'Feyenoord werd 16 keer landskampioen, voor het laatst in 2023.' },
    { question: 'Wie was de trainer toen Feyenoord in 2017 kampioen werd?', options: ["Ronald Koeman", "Fred Rutten", "Giovanni van Bronckhorst", "Arne Slot"], correct: 2, fact: 'Giovanni van Bronckhorst leidde Feyenoord naar het kampioenschap in 2017.' },
    { question: 'Tegen welke club speelde Feyenoord de Europa Cup I finale?', options: ["Real Madrid", "AC Milan", "Celtic", "Inter Milan"], correct: 2, fact: 'Feyenoord versloeg Celtic met 2-1 in de finale.' },
    { question: 'Wanneer won Feyenoord de UEFA Cup voor het laatst?', options: ["1974", "2010", "2002", "2022"], correct: 2, fact: 'Feyenoord won de UEFA Cup in 2002 door Borussia Dortmund te verslaan.' },
    { question: 'Wat is het clublied van Feyenoord?', options: ["We Are The Champions", "Hand in Hand", "You'll Never Walk Alone", "The Final"], correct: 1, fact: '\'Hand in Hand, kameraden\' is het officiële clublied.' },
    { question: 'Welke Feyenoorder werd \'De Kromme\' genoemd?', options: ["Coen Moulijn", "Wim van Hanegem", "Wim Jansen", "Rinus Israël"], correct: 1, fact: 'Wim van Hanegem kreeg die bijnaam vanwege zijn onorthodoxe speelstijl.' },
    { question: 'Hoeveel toeschouwers kan De Kuip bevatten?', options: ["47.500", "51.117", "54.000", "60.000"], correct: 0, fact: 'De Kuip heeft een capaciteit van 47.500 zitplaatsen.' },
    { question: 'Welke club is de grootste rivaal van Feyenoord?', options: ["PSV", "Sparta", "Ajax", "AZ"], correct: 2, fact: 'De Klassieker tussen Feyenoord en Ajax is de grootste rivaliteit in Nederland.' },
    { question: 'In welk jaar werd Feyenoord opgericht?', options: ["1898", "1928", "1918", "1908"], correct: 3, fact: 'Feyenoord werd opgericht op 19 juli 1908.' },
    { question: 'Welke Feyenoorder werd later trainer van Liverpool?', options: ["Dirk Kuyt", "Giovanni van Bronckhorst", "Arne Slot", "Gini Wijnaldum"], correct: 2, fact: 'Arne Slot werd na zijn succes bij Feyenoord trainer van Liverpool in 2024.' },
    { question: 'Welk rugnummer droeg Coen Moulijn?', options: ["7", "9", "10", "11"], correct: 3, fact: 'Coen Moulijn droeg het iconische nummer 11.' },
    { question: 'Hoeveel Europese prijzen heeft Feyenoord gewonnen?', options: ["1", "2", "3", "4"], correct: 2, fact: 'Feyenoord won de Europa Cup I (1970), de UEFA Cup (1974, 2002).' },
    { question: 'Wie was de topscorer in het kampioensjaar 2023?', options: ["Santiago Giménez", "Orkun Kökçü", "Lutsharel Geertruida", "David Hancko"], correct: 0, fact: 'Santiago Giménez scoorde 23 goals in de Eredivisie.' },
  ],
};


const QUESTIONS_PER_CATEGORY = 7;
const AD_INTERVAL = 3;
const BALANS_COACH_APP_ID = '6757333330'; // Apple ID van BalansCoach Pro

const categoryColors = {
  plekken: { from: '#f97316', to: '#ea580c', bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)' },
  geschiedenis: { from: '#3b82f6', to: '#2563eb', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)' },
  bekende: { from: '#a855f7', to: '#9333ea', bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)' },
  rotterdams: { from: '#22c55e', to: '#16a34a', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)' },
  feyenoord: { from: '#dc2626', to: '#b91c1c', bg: 'rgba(220, 38, 38, 0.1)', border: 'rgba(220, 38, 38, 0.3)' },
};

const categoryMeta = {
  plekken: { name: 'Plekken', emoji: '🏙️' },
  geschiedenis: { name: 'Geschiedenis', emoji: '📜' },
  bekende: { name: 'Bekende 010\'ers', emoji: '👥' },
  rotterdams: { name: 'Rotterdams', emoji: '💬' },
  feyenoord: { name: 'Feyenoord', emoji: '⚽' },
};

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function BalansCoachAd({ visible, onClose }) {
  const handleOpenStore = () => {
    Linking.openURL(`https://apps.apple.com/app/id${BALANS_COACH_APP_ID}`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.adModal}>
          <TouchableOpacity style={styles.adCloseButton} onPress={onClose}>
            <Text style={styles.adCloseText}>×</Text>
          </TouchableOpacity>
          
          <Text style={styles.adEmoji}>⚖️</Text>
          <Text style={styles.adTitle}>BalansCoach Pro</Text>
          <Text style={styles.adDescription}>
            Krijg meer balans in je leven met persoonlijke coaching en concrete tools
          </Text>
          
          <View style={styles.adFeatures}>
            <View style={styles.adFeature}>
              <Text style={styles.adFeatureEmoji}>📊</Text>
              <Text style={styles.adFeatureText}>Analyse</Text>
            </View>
            <View style={styles.adFeature}>
              <Text style={styles.adFeatureEmoji}>🎯</Text>
              <Text style={styles.adFeatureText}>Doelen</Text>
            </View>
            <View style={styles.adFeature}>
              <Text style={styles.adFeatureEmoji}>💪</Text>
              <Text style={styles.adFeatureText}>Groei</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.adButton} onPress={handleOpenStore}>
            <Text style={styles.adButtonText}>Download BalansCoach Pro</Text>
          </TouchableOpacity>
          <Text style={styles.adSubtext}>Gratis te downloaden</Text>
        </View>
      </View>
    </Modal>
  );
}

function SmallBalansCoachBanner({ onPress }) {
  return (
    <TouchableOpacity style={styles.smallBanner} onPress={onPress}>
      <View style={styles.smallBannerContent}>
        <Text style={styles.smallBannerEmoji}>⚖️</Text>
        <View style={styles.smallBannerText}>
          <Text style={styles.smallBannerTitle}>BalansCoach Pro</Text>
          <Text style={styles.smallBannerSubtitle}>Meer balans in je leven</Text>
        </View>
        <Text style={styles.smallBannerArrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

function App() {
  const [screen, setScreen] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryQuestions, setCategoryQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFact, setShowFact] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [categoryScores, setCategoryScores] = useState({});
  const [completedCategories, setCompletedCategories] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [adShownCount, setAdShownCount] = useState(0);
  const [bannerQuestionNumber, setBannerQuestionNumber] = useState(null);
  const [gameId, setGameId] = useState(0);

  const startCategory = (category) => {
    setBannerQuestionNumber(Math.floor(Math.random() * 3) + 2); // Random tussen 2-4
    setSelectedCategory(category);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFact(false);
    
    const questions = shuffleArray(questionPool[category]).slice(0, QUESTIONS_PER_CATEGORY);
    setCategoryQuestions(questions);
    setScreen('quiz');
  };

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === categoryQuestions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setTimeout(() => setShowFact(true), 500);
  };

  const nextQuestion = () => {
    if (currentQuestion < QUESTIONS_PER_CATEGORY - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFact(false);
    } else {
      const newCategoryScores = { ...categoryScores, [selectedCategory]: score };
      setCategoryScores(newCategoryScores);
      setCompletedCategories(prev => [...prev, selectedCategory]);
      setTotalScore(prev => prev + score);
      setTotalQuestions(prev => prev + QUESTIONS_PER_CATEGORY);
      setScreen('result');
    }
  };

  const continueToMenu = () => {
    if ((completedCategories.length + 1) % AD_INTERVAL === 0 && adShownCount < 10) {
      setShowAd(true);
      setAdShownCount(prev => prev + 1);
    }
    setScreen('home');
  };

  const showFinalResults = () => {
    setScreen('final');
  };

  const resetGame = () => {
    setScreen('home');
    setCompletedCategories([]);
    setCategoryScores({});
    setTotalScore(0);
    setTotalQuestions(0);
    setStreak(0);
    setAdShownCount(0);
    setGameId(prev => prev + 1);
  };

  const shareResult = async (category, catScore, catPercentage) => {
    const categoryName = categoryMeta[category].name;
    const emoji = categoryMeta[category].emoji;
    
    let kwalificatie = '';
    if (catPercentage >= 90) kwalificatie = 'Rotterdam EXPERT!';
    else if (catPercentage >= 70) kwalificatie = 'Goed bezig!';
    else if (catPercentage >= 50) kwalificatie = 'Niet slecht!';
    else kwalificatie = 'Nog even oefenen...';
    
    const message = `${emoji} ${categoryName}: ${catScore}/${QUESTIONS_PER_CATEGORY} (${catPercentage}%)\n\n${kwalificatie}\n\nDurf jij het aan?\nhttps://apps.apple.com/nl/app/id6758551466`;
    
    await Clipboard.setStringAsync(message);
    
    Alert.alert(
      "Score gekopieerd!",
      "Open WhatsApp en plak je bericht.",
      [{ text: "Open WhatsApp", onPress: () => Linking.openURL('whatsapp://') }]
    );
  };
  
    const shareFinalResult = async () => {
    const percentage = Math.round((totalScore / totalQuestions) * 100);
    
    let kwalificatie = '';
    if (percentage >= 90) kwalificatie = 'Havenbaas';
    else if (percentage >= 75) kwalificatie = 'Super Gers';
    else if (percentage >= 60) kwalificatie = 'Echte Rotterdammer';
    else if (percentage >= 40) kwalificatie = 'Halve Rotterdammer';
    else kwalificatie = 'Toerist';
    
    const message = `Ik ben een ${kwalificatie}! 🏙️\n\nScore: ${totalScore}/${totalQuestions} (${percentage}%)\n\nDurf jij het aan?\nhttps://apps.apple.com/nl/app/id6758551466\n\nNie lullen maar poetsen! 💪`;
    
    await Clipboard.setStringAsync(message);
    
    Alert.alert(
      "Score gekopieerd!",
      "Open WhatsApp en plak je bericht.",
      [{ text: "Open WhatsApp", onPress: () => Linking.openURL('whatsapp://') }]
    );
  };

  const allCategoriesComplete = completedCategories.length === Object.keys(questionPool).length;
  const totalPoolSize = Object.values(questionPool).reduce((sum, cat) => sum + cat.length, 0);

  const renderHome = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.homeScroll}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🏙️ {totalPoolSize}+ vragen</Text>
          </View>
          
          <Text style={styles.title}>HOE ROTTERDAMS</Text>
          <Text style={styles.titleAccent}>BEN JIJ?</Text>
          
          {completedCategories.length === 0 && (
            <Text style={styles.subtitle}>
              Test je kennis over Rotterdam! {QUESTIONS_PER_CATEGORY} random vragen per categorie.
            </Text>
          )}
          
          {completedCategories.length > 0 && !allCategoriesComplete && (
            <View style={styles.progressBadge}>
              <Text style={styles.progressText}>
                {totalScore}/{totalQuestions} goed · {completedCategories.length}/5 categorieën
              </Text>
            </View>
          )}
        </View>

        <View style={styles.categories}>
          {Object.keys(questionPool).map((category) => {
            const isCompleted = completedCategories.includes(category);
            const catScore = categoryScores[category];
            const colors = categoryColors[category];
            const poolSize = questionPool[category].length;
            
            return (
              <TouchableOpacity
                key={category}
                onPress={() => !isCompleted && startCategory(category)}
                disabled={isCompleted}
                style={[
                  styles.categoryButton,
                  { 
                    borderColor: isCompleted ? '#3d3d4d' : colors.border,
                    opacity: isCompleted ? 0.5 : 1,
                  }
                ]}
              >
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryIcon, { backgroundColor: colors.bg }]}>
                    <Text style={styles.categoryEmoji}>{categoryMeta[category].emoji}</Text>
                  </View>
                  <View>
                    <Text style={styles.categoryName}>{categoryMeta[category].name}</Text>
                    <Text style={styles.categoryCount}>{poolSize} vragen</Text>
                  </View>
                </View>
                
                <View style={styles.categoryRight}>
                  {isCompleted && catScore !== undefined && (
                    <>
                      <Text style={styles.categoryScore}>{catScore}/{QUESTIONS_PER_CATEGORY}</Text>
                      <Text style={styles.categoryPercent}>{Math.round((catScore / 10) * 100)}%</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {allCategoriesComplete && (
          <TouchableOpacity style={styles.finalButton} onPress={showFinalResults}>
            <Text style={styles.finalButtonText}>🏆 Bekijk Eindresultaat</Text>
          </TouchableOpacity>
        )}

        {completedCategories.length > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetButtonText}>Opnieuw beginnen</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      <BalansCoachAd visible={showAd} onClose={() => setShowAd(false)} />
    </SafeAreaView>
  );

  const renderQuiz = () => {
    const q = categoryQuestions[currentQuestion];
    const colors = categoryColors[selectedCategory];
    
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.quizContainer}>
	    <View style={styles.quizHeader}>
            <View style={styles.quizHeaderRow}>
              <Text style={styles.quizCategory}>
                {categoryMeta[selectedCategory].emoji} {categoryMeta[selectedCategory].name}
              </Text>
              <TouchableOpacity
                style={styles.quizCloseButton}
                onPress={() => {
                  Alert.alert(
                    'Quiz stoppen?',
                    'Je voortgang in deze categorie gaat verloren.',
                    [
                      { text: 'Nee', style: 'cancel' },
                      { text: 'Stoppen', style: 'destructive', onPress: () => setScreen('home') }
                    ]
                  );
                }}
              >
                <Text style={styles.quizCloseButtonText}>⬅ Menu</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.quizProgress}>
              Vraag {currentQuestion + 1}/{QUESTIONS_PER_CATEGORY}
            </Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${((currentQuestion + 1) / QUESTIONS_PER_CATEGORY) * 100}%`, backgroundColor: colors.from }
                ]} 
              />
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.quizScroll}>
            <Text style={styles.question}>{q.question}</Text>

            {q.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === q.correct;
              const showResult = selectedAnswer !== null;

              let buttonStyle = styles.optionButton;
              let buttonColor = 'rgba(255, 255, 255, 0.05)';
              let borderColor = 'rgba(255, 255, 255, 0.1)';

              if (showResult) {
                if (isCorrect) {
                  buttonColor = 'rgba(34, 197, 94, 0.2)';
                  borderColor = '#22c55e';
                } else if (isSelected && !isCorrect) {
                  buttonColor = 'rgba(239, 68, 68, 0.2)';
                  borderColor = '#ef4444';
                }
              }

              return (
                <TouchableOpacity
                  key={idx}
                  style={[buttonStyle, { backgroundColor: buttonColor, borderColor, borderWidth: 2 }]}
                  onPress={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                >
                  <Text style={styles.optionLetter}>{String.fromCharCode(65 + idx)}</Text>
                  <Text style={styles.optionText}>{option}</Text>
                  {showResult && isCorrect && <Text style={styles.optionCheck}>✓</Text>}
                  {showResult && isSelected && !isCorrect && <Text style={styles.optionCross}>✗</Text>}
                </TouchableOpacity>
              );
            })}

            {showFact && (
              <View style={[styles.factBox, { backgroundColor: colors.bg }]}>
                <Text style={styles.factTitle}>💡 Wist je dat...</Text>
                <Text style={styles.factText}>{q.fact}</Text>
              </View>
            )}


            {showFact && currentQuestion === bannerQuestionNumber && (
              <SmallBalansCoachBanner onPress={() => Linking.openURL(`https://apps.apple.com/app/id${BALANS_COACH_APP_ID}`)} />
            )}

            {showFact && (
              <TouchableOpacity 
                style={[styles.nextButton, { backgroundColor: colors.from }]} 
                onPress={nextQuestion}
              >
                <Text style={styles.nextButtonText}>
                  {currentQuestion < QUESTIONS_PER_CATEGORY - 1 ? 'Volgende vraag →' : 'Bekijk resultaat →'}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };

  const renderResult = () => {
    const colors = categoryColors[selectedCategory];
    const percentage = Math.round((score / QUESTIONS_PER_CATEGORY) * 100);
    
    let title, emoji, message;
    if (percentage >= 90) {
      title = 'Rotterdam EXPERT!';
      emoji = '🏆';
      message = 'Je bent een echte 010\'er!';
    } else if (percentage >= 70) {
      title = 'Goed bezig!';
      emoji = '🌟';
      message = 'Je kent Rotterdam goed!';
    } else if (percentage >= 50) {
      title = 'Niet slecht!';
      emoji = '👍';
      message = 'Maar er valt nog wat te leren...';
    } else {
      title = 'Nog even oefenen...';
      emoji = '📚';
      message = 'Rotterdam heeft nog veel te bieden!';
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <Text style={styles.resultEmoji}>{emoji}</Text>
          <Text style={styles.resultTitle}>{title}</Text>
          <Text style={styles.resultMessage}>{message}</Text>

          <View style={[styles.scoreCard, { borderColor: colors.border }]}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={[styles.scoreValue, { color: colors.from }]}>
              {score}/{QUESTIONS_PER_CATEGORY}
            </Text>
            <Text style={styles.scorePercentage}>{percentage}% goed</Text>
          </View>

          <View style={styles.categoryInfo}>
            <Text style={styles.categoryInfoTitle}>
              {categoryMeta[selectedCategory].emoji} {categoryMeta[selectedCategory].name}
            </Text>
            <Text style={styles.categoryInfoText}>
              Je hebt {score} van de {QUESTIONS_PER_CATEGORY} vragen goed beantwoord!
            </Text>
          </View>


          {allCategoriesComplete ? (
            <TouchableOpacity style={styles.finalButton} onPress={showFinalResults}>
              <Text style={styles.finalButtonText}>🏆 Bekijk Eindresultaat</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.continueButton, { backgroundColor: colors.from }]} 
              onPress={continueToMenu}
            >
              <Text style={styles.continueButtonText}>Ga verder →</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuButton} onPress={continueToMenu}>
            <Text style={styles.menuButtonText}>Terug naar menu</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const renderFinal = () => {
    const percentage = Math.round((totalScore / totalQuestions) * 100);
    
    let title, emoji, message;
    if (percentage >= 90) {
      title = "HAVENBAAS! ⚓";
      emoji = "👑";
      message = "Je weet ALLES van 010!";
    } else if (percentage >= 75) {
      title = "Super Gers! 🔥";
      emoji = "🏆";
      message = "Je bent een echte Rotterdammer!";
    } else if (percentage >= 60) {
      title = "Echte 010-er! 💪";
      emoji = "🌟";
      message = "Je kent je stad aardig!";
    } else if (percentage >= 40) {
      title = "Halve Rotterdammer";
      emoji = "🚢";
      message = "Nog effe an het gas!";
    } else {
      title = "Tourist! 📸";
      emoji = "📚";
      message = "Tijd om Rotterdam te ontdekken!";
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.finalScroll}>
          <Text style={styles.finalEmoji}>{emoji}</Text>
          <Text style={styles.finalTitle}>{title}</Text>
          <Text style={styles.finalMessage}>{message}</Text>

          <View style={styles.finalScoreCard}>
            <Text style={styles.finalScoreLabel}>Totaal Score</Text>
            <Text style={styles.finalScoreValue}>{totalScore}/{totalQuestions}</Text>
            <Text style={styles.finalScorePercentage}>{percentage}% correct</Text>
          </View>

          <View style={styles.breakdown}>
            <Text style={styles.breakdownTitle}>Per categorie:</Text>
            {Object.keys(questionPool).map((category) => {
              const catScore = categoryScores[category];
              if (catScore === undefined) return null;
              const colors = categoryColors[category];
              const percentage = Math.round((catScore / 10) * 100);
              
              return (
                <View key={category} style={styles.breakdownItem}>
                  <Text style={styles.breakdownCategory}>
                    {categoryMeta[category].emoji} {categoryMeta[category].name}
                  </Text>
                  <View style={styles.breakdownRight}>
                    <View style={styles.breakdownBar}>
                      <View 
                        style={[styles.breakdownFill, { width: `${percentage}%`, backgroundColor: colors.from }]} 
                      />
                    </View>
                    <Text style={styles.breakdownScore}>{catScore}/{QUESTIONS_PER_CATEGORY}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={shareFinalResult}>
            <Text style={styles.shareButtonText}>📤 Deel je resultaat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
            <Text style={styles.playAgainButtonText}>🔄 Opnieuw spelen</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => setScreen('home')}>
            <Text style={styles.menuButtonText}>Terug naar menu</Text>
          </TouchableOpacity>

          <Text style={styles.finalFooter}>Nie lullen maar poetsen! 🏙️</Text>
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <>
      {screen === 'home' && renderHome()}
      {screen === 'quiz' && renderQuiz()}
      {screen === 'result' && renderResult()}
      {screen === 'final' && renderFinal()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  
  // Home styles
  homeScroll: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  badge: {
    backgroundColor: 'rgba(153, 27, 27, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(153, 27, 27, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  badgeText: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
  },
  titleAccent: {
    fontSize: 32,
    fontWeight: '900',
    color: '#e94560',
  },
  subtitle: {
    color: '#9ca3af',
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
  },
  progressBadge: {
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
  },
  progressText: {
    color: '#d1d5db',
    fontSize: 14,
  },
  
  // Categories
  categories: {
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  categoryCount: {
    color: '#9ca3af',
    fontSize: 14,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryScore: {
    color: '#4ade80',
    fontSize: 18,
    fontWeight: '700',
  },
  categoryPercent: {
    color: '#9ca3af',
    fontSize: 12,
  },
  finalButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  finalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#9ca3af',
    fontSize: 14,
  },

  // Quiz styles
  quizContainer: {
    flex: 1,
  },
  quizHeader: {
    padding: 20,
    paddingTop: 16,
  },
  quizHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizCloseButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  quizCloseButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  quizCategory: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8,
  },
  quizProgress: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  quizScroll: {
    padding: 20,
  },
  question: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    lineHeight: 32,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  optionCheck: {
    color: '#22c55e',
    fontSize: 24,
    fontWeight: '700',
  },
  optionCross: {
    color: '#ef4444',
    fontSize: 24,
    fontWeight: '700',
  },
  factBox: {
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  factTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  factText: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 20,
  },
  nextButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Result styles
  resultScroll: {
    padding: 20,
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 80,
    marginVertical: 24,
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
  },
  resultMessage: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 32,
  },
  scoreCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
  },
  scorePercentage: {
    color: '#d1d5db',
    fontSize: 16,
  },
  categoryInfo: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  categoryInfoTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  categoryInfoText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  continueButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  shareButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#059669',
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  menuButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuButtonText: {
    color: '#9ca3af',
    fontSize: 14,
  },

  // Final styles
  finalScroll: {
    padding: 20,
    alignItems: 'center',
  },
  finalEmoji: {
    fontSize: 80,
    marginVertical: 24,
  },
  finalTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  finalMessage: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  finalScoreCard: {
    width: '100%',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  finalScoreLabel: {
    color: '#93c5fd',
    fontSize: 14,
    marginBottom: 8,
  },
  finalScoreValue: {
    color: '#3b82f6',
    fontSize: 48,
    fontWeight: '900',
  },
  finalScorePercentage: {
    color: '#bfdbfe',
    fontSize: 16,
  },
  breakdown: {
    width: '100%',
    marginBottom: 24,
  },
  breakdownTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  breakdownCategory: {
    color: '#d1d5db',
    fontSize: 14,
    flex: 1,
  },
  breakdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownBar: {
    width: 64,
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownScore: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    width: 48,
    textAlign: 'right',
  },
  playAgainButton: {
    width: '100%',
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  playAgainButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  finalFooter: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 24,
    textAlign: 'center',
  },
  
  // Ad Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  adModal: {
    backgroundColor: '#166534',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  adCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
  },
  adCloseText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 20,
  },
  adEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  adTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  adDescription: {
    color: '#bbf7d0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  adFeatures: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    justifyContent: 'space-around',
  },
  adFeature: {
    alignItems: 'center',
  },
  adFeatureEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  adFeatureText: {
    color: '#ffffff',
    fontSize: 12,
  },
  adButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  adButtonText: {
    color: '#166534',
    fontSize: 16,
    fontWeight: '700',
  },
  adSubtext: {
    color: '#86efac',
    fontSize: 12,
  },
  smallBanner: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  smallBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallBannerEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  smallBannerText: {
    flex: 1,
  },
  smallBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#166534',
  },
  smallBannerSubtitle: {
    fontSize: 12,
    color: '#15803d',
    marginTop: 2,
  },
  smallBannerArrow: {
    fontSize: 20,
    color: '#16a34a',
  }
});
export default App;
