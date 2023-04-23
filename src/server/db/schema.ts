import {
  int,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core/columns";
import { index, uniqueIndex } from "drizzle-orm/mysql-core/indexes";
import { mysqlTable } from "drizzle-orm/mysql-core/table";

export const organisations = mysqlTable(
  "organisations",
  {
    id: serial("id").primaryKey(),
    owner_id: varchar("owner_id", { length: 191 }).notNull(),
    slug: varchar("slug", { length: 191 }).notNull(),
    name: text("name").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
  },
  (organisations) => ({
    ownerIdIndex: uniqueIndex("owner_idx").on(organisations.owner_id),
  })
);

export const locations = mysqlTable(
  "locations",
  {
    id: serial("id").primaryKey(),
    organisationId: int("organisation_id").references(() => organisations.id), // inline foreign key
    organisationName: varchar("organisation_id", { length: 256 }),
    place_id: varchar("place_id", { length: 191 }).notNull(),
    name: text("name").notNull(),
    address: text("address"),
    postcode: text("postcode"),
    email: text("email"),
    phone: text("phone"),
    created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
  },
  (locations) => ({
    organisationIdIndex: index("organisation_idx").on(
      locations.organisationId,
      locations.organisationName
    ),
  })
);

export const voidRequirements = mysqlTable("voids", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
});

export const voids = mysqlTable(
  "voids",
  {
    id: serial("id").primaryKey(),
    locationId: int("location_id").references(() => locations.id), // inline foreign key
    locationName: varchar("location_id", { length: 256 }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    password: text("password"),
    created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
  },
  (voids) => ({
    locationIdIndex: index("location_idx").on(
      voids.locationId,
      voids.locationName
    ),
  })
);

export const voidsToRequirements = mysqlTable("voidsToRequirements", {
  void_id: int("void_id")
    .notNull()
    .references(() => voids.id),
  requirement_id: int("requirement_id")
    .notNull()
    .references(() => voidRequirements.id),
});
