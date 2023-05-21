import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { typeDefs } from "./schema"
import { getJacobsTrack } from "./spotify_connection"
import { getPersonalProjectInformation } from "./github_connection"

const resolvers = {
  Query: {
    track: (i, args) => {
      return getJacobsTrack(args["track_num"])
    },
    project: (i, args) => {
      return getPersonalProjectInformation(args["user"], args["project_name"])
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

startStandaloneServer(server, {
  listen: { port: 8080 },
}).then((url) => {
  console.log(`Server At : ${JSON.stringify(url)}`)
})
