
name := "acquisition-event-producer"

version := "0.1.0"

scalaVersion := "2.11.11"

addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)

resolvers += Resolver.bintrayRepo("guardian", "ophan")

libraryDependencies ++= Seq(
  "com.github.mpilquist" %% "simulacrum" % "0.10.0",
  "com.gu" %% "ophan-event-model" % "1.0.0",
  "io.circe" %% "circe-core" % "0.8.0",
  "io.lemonlabs" %% "scala-uri" % "0.5.0",
  "org.scalactic" %% "scalactic" % "3.0.1",
  "org.scalatest" %% "scalatest" % "3.0.1" % "test",
  "org.scalaj" %% "scalaj-http" % "2.3.0",
  "org.typelevel" %% "cats" % "0.9.0"
)

licenses += ("MIT", url("http://opensource.org/licenses/MIT"))
organization := "com.gu"
bintrayOrganization := Some("guardian")
bintrayRepository := "ophan"
publishMavenStyle := true