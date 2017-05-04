addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "0.9.5")

addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.1.1")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.14.3")

addSbtPlugin("com.typesafe.sbt" % "sbt-s3" % "0.9")

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "0.7.0" excludeAll ExclusionRule(organization = "com.danieltrinh"))

libraryDependencies += "org.scalariform" %% "scalariform" % "0.1.7"