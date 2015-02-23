XBDD automatic upload JSON results
==================================
These steps allow you to configure your maven project to upload test results directly to XBDD automatically on test completion.

Configuration
------------
### Generate JSON Report

Add JSON formatter to Cucumber Options in test class

Use strict mode for non-manual reports

```java
@RunWith(Cucumber.class)
@CucumberOptions(tags = { "~@manual" }, format = { "pretty", "html:target/cukes", "usage:target/usage.json",
		"json:target/cucumber-report.json" },
		monochrome = true, strict = true)
public class RunCukesIT{}
```

Use non-strict dryRun for manual report

```java
@RunWith(Cucumber.class)
@CucumberOptions(tags = { "@manual" }, format = { "pretty",
		"json:target/cucumber-manual-report.json" },
		monochrome = true, strict = false, dryRun = true)
public class DryRunCukesIT{}
```

### Minimum Cucumber versions
Getting a 500 error / Null Pointer Exceptions?
XBDD expects EVERY step to have a "result" element, some earlier versions of cucumber do not include a "result" element on
every step; only including it on the last executed element. Update your cucumber to 1.1.3 as a minimum (note this seems to also
necessitate a minimum of of Junit 4.1.1

### Upload JSON Report

Add post-integration phase to upload JSON report to xbdd instance in the project pom.xml:

```xml
<plugin>
  <artifactId>maven-antrun-plugin</artifactId>
  <version>1.7</version>
  <executions>
    <execution>
      <id>Upload report to XBDD</id>
      <phase>post-integration-test</phase>
      <goals>
        <goal>run</goal>
      </goals>
      <configuration>
        <target name="bdd.report.publish" if="publish.to.xbdd">
          <exec executable="curl">
            <arg value="-X" />
            <arg value="PUT" />
            <arg value="-d" />
            <arg value="@./target/cucumber-report.json" />
            <arg
              value="https://{{YOUR-XBDD-CONTEXT-ROOT}}/rest/reports/${project.artifactId}/${version.major}.${version.minor}.${version.servicepack}/${buildNumber}" />
            <arg value="--header" />
            <arg value="Content-Type:application/json" />
            <arg value="-u" />
            <arg value="${xbdd.username}:${xbdd.password}" />
            <arg value="-k" />
            <arg value="-sS" />
          </exec>
          <exec executable="curl">
            <arg value="-X" />
            <arg value="PUT" />
            <arg value="-d" />
            <arg value="@./target/cucumber-manual-report.json" />
            <arg
              value="https://{{YOUR-XBDD-CONTEXT-ROOT}}/rest/reports/${project.artifactId}/${version.major}.${version.minor}.${version.servicepack}/${buildNumber}" />
            <arg value="--header" />
            <arg value="Content-Type:application/json" />
            <arg value="-u" />
            <arg value="${xbdd.username}:${xbdd.password}" />
            <arg value="-k" />
            <arg value="-sS" />
          </exec>
        </target>
      </configuration>
    </execution>
  </executions>
</plugin>
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-failsafe-plugin</artifactId>
  <version>2.17</version>
  <configuration>
    <excludes>
      <exclude>**/RunNowCukesIT.java</exclude>
    </excludes>
  </configuration>
  <executions>
    <execution>
      <goals>
        <goal>integration-test</goal>
        <goal>verify</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

This may need tweaks depending on your file structure.

####Extra information
Project artifactId and version need to be current in the POM.
Project version can only contain numbers and full stops.
Build number is passed in from the command line.


For pre-existing projects:
--------------------------
"Phase" refers to the maven phase at/before which all your acceptance tests are run. To publish to XBDD regardless of test outcomes, tests should be run in the integration-test phase.

1. Change any cucumber acceptance test classes to \*IT instead of \*Test - i.e. rename RunCukesTest to RunCukesIT
2. If you have no unit tests you can remove the maven-surefire-plugin from your pom

Run
-------------
Run the project using the mvn verify command, for example:

```
mvn verify -Dpublish.to.xbdd -Dxbdd.username=user -Dxbdd.password=strongPassword -DbuildNumber=123
```

To run a specific test use include the `it.test` parameter, e.g.  `-Dit.test=RunCukesIT`.
