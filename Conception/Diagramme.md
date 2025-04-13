@startuml
left to right direction
skinparam linetype ortho
skinparam rectangle {
  BackgroundColor<<frontend>> #D0E8FF
  BackgroundColor<<backend>> #C8FFD4
  BackgroundColor<<database>> #FFE0B2
  BackgroundColor<<external>> #FFD6D6
  BorderColor black
}

actor "Utilisateur" as User

rectangle "Frontend\nReact + Tailwind" <<frontend>> {
  component "Pages UI" as UI
  component "Appels API (Axios)" as APICall
}

rectangle "Backend\nNode.js + Express" <<backend>> {
  component "Contrôleurs (routes REST)" as Controllers
  component "Services Métier" as Services
  component "Appels Riot API" as RiotService
  component "JWT Auth / Sécurité" as Auth
  component "ORM (Prisma)" as ORM
}

rectangle "Base de données\nPostgreSQL" <<database>> {
  database "Users" as DBUsers
  database "GameAccounts" as DBAccounts
  database "Matches" as DBMatches
  database "Champions" as DBChampions
}

rectangle "API externe\nRiot Games API" <<external>> {
  cloud "Summoner API\nMatch API" as RiotAPI
}

' Relations utilisateur
User --> UI : Interagit avec

' Frontend vers backend
UI --> APICall
APICall --> Controllers : Requêtes HTTP (REST)

' Backend interne
Controllers --> Auth
Controllers --> Services
Services --> ORM
Services --> RiotService
RiotService --> RiotAPI : Appels HTTPS

' ORM vers BDD
ORM --> DBUsers
ORM --> DBAccounts
ORM --> DBMatches
ORM --> DBChampions
@enduml