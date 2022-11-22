# Instant Developer filelist generator


Simple utility used to create the import filelist required when developing integrating custom components in an Instant Developer Foundation project.



## Installation

```bash
    npm i -g inde-filelist-generator
```


## Usage

##### navigate to the custom directory of your project, then:
```bash
    inde-filelist generate
```

##### or, without navigating, you can specify the path of your custom directory with the "--path" option

```bash
    inde-filelist generate --path "D:\AndreaCuppini_tech\Inde\projects\My Project\custom"
```
##### The filelis will be finally generated in your project custom directory

##### in addition, you can specify --asjson true to export in a Json File the list of all filename (without extension founded in a base path)

```bash
    inde-filelist generate --path "D:\AndreaCuppini_tech\Inde\projects\My Project\custom"  --asjson true
```
