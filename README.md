🤿 一个 COS 自动上传工具（代码自动生成）

## 解决的痛点

<del>😤 繁琐的图片上传</del>

<del>😭 容易出错的 url 硬编码</del>

<del>😂 无可奈何的 cdn 缓存</del>

## 安装

```bash
npm install -g static-automator # or `sudo npm install -g static-automator `
```

## 使用

```bash
static-automator -h

# Usage: static-automator [options]

# Options:
#   --secretId <string>   Secret Id
#   --secretKey <string>  Secret Key
#   -i, --init            初始化配置文件
#   -s, --sync            上传图片到存储桶
#   -g, --gen             生成相关代码
#   -h, --help            display help for command
```

## 配置

```yaml
# https://console.cloud.tencent.com/cam/capi
# https://ram.console.aliyun.com/manage/ak

"type": "tencent" # or "type": "ali"
"secret_id": "secret_id",
"secret_key": "secret_key",

# 对象存储/桶详情/概览: 可以找到相应的配置
"bucket": "bucket_name",
"region": "bucket_region",

"base": "存储桶目录",

"input": "上传的图片目录",
"output": "代码生成目录",

# scss: 生成 scss vars 文件
# js: 生成 js helper 文件
"generate": { "scss": true, "js": true }
```
