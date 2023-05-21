export const typeDefs = `#graphql
    type Track {
        track_num : Int!
        title : String!
        preview : String!
        cover : String!
        release_date : String!
        track_description_info : TrackDescriptionInfo
    }

    type TrackDescriptionInfo {
        acousticness : Float!
        danceability : Float!
        energy : Float!
        time_signature : String!
        valence : Float!
    }

    type Project {
        name : String!
        description : String!
        image : String
    }

    type Query {
        track(track_num : Int!) : Track
        project(user : String!, project_name : String!) : Project
    }

`
