# Form Assist on Fess

[Fess](https://fess.codelibs.org/) is Enterprise Search Server.
This docker environment provides Form Assist Script on Fess.


## Getting Started

### Setup

```
$ git clone https://github.com/codelibs/docker-formassist.git
$ cd docker-formassist
$ bash setup.sh
```

### Start Server

```
$ docker-compose up -d
```

以下のURLへアクセスを確認。

* Fess
  * http://localhost/admin
  * http://localhost/json
* Script
  * http://localhost/formassist/formassist/fess-form-assist.js
* Sample
  * http://localhost/formassist/sample.html


### Load script
fess-form-assist.jsをロードします。

```
<script src="http://localhost/formassist/formassist/fess-form-assist.js"></script>
```


### Sample Code

[sample.html](nginx/static/sample.html)


## Usage

サジェスト/アシスト対象のform群を `fess-form-assist` クラスでラップします。 
```
<div class="fess-form-assist">
...
</div>
```

### サジェストの設定

サジェストを利用するために、サジェスト対象のInput要素に `fess-suggest` クラスを設定します。

```
<div class="fess-form-assist">
    <input type="text" class="fess-suggest"
        data-fess_url="http://localhost:10080/json"
        data-field="name_assist"
        data-results_num="3"
        data-results="name_assist,address1_assist,address2_assist"
        data-result_headers="Client Name,Address1,Address2">
    </input>
</div>
```

 `fess-suggest` では下記の属性を設定します。

|ヘッダ１|ヘッダ２|
|---|---|
|左寄せ|中央揃え|
|LEFTLEFTLEFT|CENTERCENTER|