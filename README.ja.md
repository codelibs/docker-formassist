# Form Assist on Fess

[Fess](https://fess.codelibs.org/) is Enterprise Search Server.
This docker environment provides Form Assist Script on Fess.


## Getting Started

### Setup

```
$ git clone https://github.com/codelibs/docker-formassist.git
$ cd docker-formassist
$ bash ./bin/setup.sh
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

サジェストを利用するために、サジェスト対象のINPUT要素に `fess-suggest` クラスを設定します。

```
<div class="fess-form-assist">
    <input type="text" class="fess-suggest"
        data-fess_url="http://localhost:10080/json"
        data-field="name_assist"
        data-results_num="3"
        data-results="name_assist,address_assist"
        data-result_headers="Client Name,Address">
    </input>
</div>
```

 `fess-suggest` クラスには下記の属性を設定します。

|属性|説明|
|---|---|
|data-fess_url|FessのJSON APIのURLを設定します。|
|data-field|サジェスト対象のフィールド名を設定します。|
|data-results_num|サジェスト結果の表示数を設定します。|
|data-results|サジェスト結果に表示するフィールドを設定します。（複数ある場合はカンマ区切り）|
|data-result_headers|サジェスト結果の各フィールドの項目名を設定します。（複数ある場合はカンマ区切り）|
|data-assist_targets|サジェストを選択した場合にアシストされる要素のIDを設定します。未指定の場合は全てのアシスト要素に適用されます。|


### アシストの設定

サジェスト選択時にアシストされる対象の要素に `fess-assist` クラスを設定します。

```
<div class="fess-form-assist">
    <input type="text" class="fess-suggest fess-assist"
        data-fess_url="http://localhost:10080/json"
        data-field="name_assist"
        data-results_num="3"
        data-results="name_assist,address_assist"
        data-result_headers="Client Name,Address">
    </input>
    <input type="text" class="fess-assist" data-field="address_assist"></input>
</div>
```

 `fess-assit` クラスには下記の属性を設定します。

 |属性|説明|
|---|---|
|data-field|アシスト対象のフィールド名を設定します。|


## サジェストのデザイン

 `fess-form-assist` クラスの要素に対して `apply-style` クラスを追加することで、サジェストボックスに対してデフォルトのCSSが適用されます。

```
<div class="fess-form-assist apply-style">
...
</div>
```

サジェストボックスの要素は以下の構成になるため、これらの要素に対してスタイルを設定することで `apply-style` を使用せずに独自のCSSを適用出来ます。

```
<div class="fess-form-assist">
    <div class="fess-suggest-box">
        <table>
            <thead>
                <tr>
                    <th>Field1</th>
                    <th>Field2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Value1</td>
                    <td>Value2</td>
                </tr>
                <tr>
                    <td>Value3</td>
                    <td>Value4</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
```