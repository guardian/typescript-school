lazy val docs = project
  .in(file("."))
  .enablePlugins(MdocPlugin)
  .settings(
    mdocIn := file("original-docs"),
    mdocOut := file("evaluated-docs")
  )
