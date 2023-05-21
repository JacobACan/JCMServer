import env from "dotenv"
env.config()

export function getPersonalProjectInformation(user, projectName) {
  const query = `
      query {
        repository(
          name: "${projectName}", 
          owner: "${user}") 
        {
          name
          url
          description
          object(expression : "HEAD:") {
            ... on Tree {
              entries {
                object {
                  ... on Blob {
                    text
                  }
                }
              }
            }
          }
        }
      }
      `
  const githubUrl = "https://api.github.com/graphql"
  return fetch(githubUrl, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_SECRET}`,
    },
  })
    .then((res) => res.json())
    .then((jsonRes) => {
      let projectInfo = {}

      projectInfo["name"] = jsonRes["data"]["repository"]["name"]
      projectInfo["description"] = jsonRes["data"]["repository"]["description"]

      let projectReadMeText =
        jsonRes["data"]["repository"]["object"]["entries"][1]["object"]["text"]

      try {
        projectInfo["image"] = projectReadMeText
          .split("[image]")[1]
          .split("(")[1]
          .split(")")[0]
      } catch {
        projectInfo["image"] = null
      }

      return projectInfo
    })
    .catch((error) => console.error(error))
}
