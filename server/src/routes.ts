import { Express } from "express";
import {
  ActionController,
  AuthController,
  BaseController,
  CarController,
  DraftController,
  DraftOrderController,
  DriverController,
  EntryController,
  RaceController,
  UserController,
} from "./controllers";
import Discord from "./Discord";
import {
  BasePolicy,
  AuthPolicy,
  ActionPolicy,
  EntryPolicy,
  UserPolicies,
  DraftPolicy,
DraftOrderPoicy,
DriverPolicy,
RacePolicy,
} from "./policies";

function register(
  app: Express,
  name: string,
  policy: BasePolicy,
  controller: BaseController
) {
  app.get(`/${name}`, policy.Get, controller.Get);
  app.post(`/${name}`, policy.Post, controller.Post);
  app.put(`/${name}`, policy.Put, controller.Put);
  app.delete(`/${name}`, policy.Delete, controller.Delete);
}

export function Routes(app: Express) {
  app.put(
    "/register",
    new AuthPolicy().register,
    new AuthController().register
  );
  app.post("/login", new AuthController().login);

  register(app, "driver", new DriverPolicy(), new DriverController());
  register(app, "race", new RacePolicy(), new RaceController());
  register(app, "user", new UserPolicies(), new UserController());
  register(app, "draft", new DraftPolicy(), new DraftController());
  register(app, "car", new BasePolicy(), new CarController());
  register(app, "entry", new EntryPolicy(), new EntryController());
  register(app, "draftorder", new DraftOrderPoicy(), new DraftOrderController());

  register(app, "action", new ActionPolicy(), new ActionController());

  app.get("/test", (req, res) => {
    console.log("Sending message");
    Discord.SendMessage("Hello World");
    res.send("OK");
  });
}
