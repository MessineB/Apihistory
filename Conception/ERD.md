@startuml
!define primary_key(x) <b>x</b>
!define foreign_key(x) <i>x</i>
hide circle
skinparam linetype ortho

entity "User" {
    primary_key(id): UUID
    email: string
    password_hash: string
    pseudo: string
    created_at: datetime
}

entity "GameAccount" {
    primary_key(id): UUID
    game_name: string
    summoner_name: string
    external_id: string
    region: string
}

entity "UserGameAccount" {
    primary_key(id): UUID
    foreign_key(user_id): UUID
    foreign_key(game_account_id): UUID
    alias: string
    favori: boolean
}

entity "Match" {
    primary_key(id): UUID
    foreign_key(game_account_id): UUID
    match_id_api: string
    date: datetime
    duration: int
    result: string
    kills: int
    deaths: int
    assists: int
    foreign_key(champion_id): UUID
}

entity "Champion" {
    primary_key(id): UUID
    name: string
    role: string
    image_url: string
}

User ||--o{ UserGameAccount : suit >
GameAccount ||--o{ UserGameAccount : est_suivi_par >
GameAccount ||--o{ Match : joue >
Champion ||--o{ Match : joué_dans >
@enduml