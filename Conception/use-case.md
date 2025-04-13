@startuml GameTrack
left to right direction
actor "Utilisateur" as User

rectangle "GameTrack" {

    User --> (S'inscrire)
    User --> (Se connecter)
    User --> (Se déconnecter)
    User --> (Modifier son profil)
    User --> (Supprimer son compte)

    User --> (Ajouter son identifiant de jeu)
    User --> (Récupérer l'historique de jeu)
    User --> (Consulter l’historique des parties)
    User --> (Voir ses statistiques globales)
    
    (Ajouter son identifiant de jeu) --> (Récupérer l'historique de jeu) : "Déclenche"
    
    // Bonus
    User --> (Ajouter d'autres jeux) : "Optionnel"
    User --> (Comparer ses stats à un ami) : "Optionnel"
    User --> (Visualiser des graphiques) : "Optionnel"
    User --> (Recevoir des notifications) : "Optionnel"
}

@enduml
