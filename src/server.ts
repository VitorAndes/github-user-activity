import cors from "cors";
import express from "express";

const port = process.env.PORT || 2222;
const githubApi = process.env.GITHUB_API;
const app = express();

const corsOptions = {
  origin: "*",
};

interface ResponseActivity {
  type: string;
  actor: {
    login: string;
    url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  public: boolean;
  created_at: string;
}

app.get("/activity", cors(corsOptions), async (req, res) => {
  try {
    const response = await fetch(`${githubApi}`);

    const activity: ResponseActivity[] = await response.json();

    if (activity.length === 0) {
      return res.status(404).send({ error: "No data" });
    }

    const activities = activity.map((activity) => ({
      type: activity.type,
      actor: {
        login: activity.actor.login,
        url: activity.actor.url,
      },
      repo: {
        name: activity.repo.name,
        url: activity.repo.url,
      },
      public: activity.public,
      created_at: activity.created_at,
    }));
    res.send(activities);
  } catch (error) {
    res.status(404).send({ error: `Internal Server Error:${error}` });
  }
});

app.listen(port, () => {
  console.log(`Project is running on port ${port}`);
});
