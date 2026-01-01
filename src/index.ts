import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";

// Controllers
import { authController } from "./controllers/auth.controller";
import { projectController } from "./controllers/project.controller";
import { timelineController } from "./controllers/timeline.controller";
import { techController } from "./controllers/tech.controller";
import { infoController } from "./controllers/info.controller";
import { eventController } from "./controllers/event.controller";
import { awardController } from "./controllers/awards.controller";

// Middleware
import { authMiddleware } from "./middlewares/auth.middleware";

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "Portfolio Backend API",
          version: "1.0.0",
          description: "API สำหรับจัดการข้อมูล Portfolio Backend",
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Public", description: "Public data endpoints" },
          { name: "Admin", description: "Admin management endpoints" },
        ],
      },
    })
  )
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )

  // Public Routes
  .group("/api", (app) =>
    app
      // --- Auth ---
      .post("/auth/login", authController.login, {
        detail: { tags: ["Auth"] },
        body: t.Object({
          username: t.String(),
          password: t.String(),
        }),
      })

      // --- Projects ---
      .get("/projects", projectController.getAll, {
        detail: { tags: ["Public"] },
      })
      .get("/projects/:id", projectController.getById, {
        detail: { tags: ["Public"] },
      })

      // --- Timeline (Experience/Education) ---
      .get("/timelines", timelineController.getAll, {
        detail: { tags: ["Public"] },
      })
      // --- Tech Stacks ---
      .get("/tech-stacks", techController.getAll, {
        detail: { tags: ["Public"] },
      })
      // --- Info (About & Contact) ---
      .get("/about", infoController.getAbout, { detail: { tags: ["Public"] } })
      .get("/contact", infoController.getContact, {
        detail: { tags: ["Public"] },
      })
      // --- Events ---
      .get("/events", eventController.getAll, { detail: { tags: ["Public"] } })
      // --- Awards ---
      .get("/awards", awardController.getAll, { detail: { tags: ["Public"] } })
  )

  // Admin Routes
  .group("/api/admin", (app) => app)
  .use(authMiddleware) // เรียกใช้ Middleware ตรวจสอบ Token

  // --- Auth Management ---
  .get("/profile", authController.getProfile, { detail: { tags: ["Admin"] } })
  .post("/logout", authController.logout, { detail: { tags: ["Admin"] } })

  // --- Project Management ---
  .post("/projectss", projectController.create, { detail: { tags: ["Admin"] } })
  .put("/projects/:id", projectController.update, {
    detail: { tags: ["Admin"] },
  })
  .delete("/projects/:id", projectController.delete, {
    detail: { tags: ["Admin"] },
  })

  // --- Timeline Management ---
  .post("/timelines", timelineController.create, {
    detail: { tags: ["Admin"] },
  })
  .put("/timelines/:id", timelineController.update, {
    detail: { tags: ["Admin"] },
  })
  .delete("/timelines/:id", timelineController.delete, {
    detail: { tags: ["Admin"] },
  })

  // --- Tech Stack Management ---
  .post("/tech-stacks", techController.create, { detail: { tags: ["Admin"] } })
  .put("/tech-stacks/:id", techController.update, {
    detail: { tags: ["Admin"] },
  })
  .delete("/tech-stacks/:id", techController.delete, {
    detail: { tags: ["Admin"] },
  })

  // --- Info Management ---
  .post("/about", infoController.upsertAbout, { detail: { tags: ["Admin"] } })
  .post("/contact", infoController.upsertContact, {
    detail: { tags: ["Admin"] },
  })

  // --- Event Management ---
  .post("/events", eventController.create, { detail: { tags: ["Admin"] } })
  .put("/events/:id", eventController.update, { detail: { tags: ["Admin"] } })
  .delete("/events/:id", eventController.delete, {
    detail: { tags: ["Admin"] },
  })

  // --- Award Management ---
  .post("/awards", awardController.create, { detail: { tags: ["Admin"] } })
  .put("/awards/:id", awardController.update, { detail: { tags: ["Admin"] } })
  .delete("/awards/:id", awardController.delete, {
    detail: { tags: ["Admin"] },
  })

  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(`📚 Swagger UI at http://localhost:8080/swagger`);
