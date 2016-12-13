# docker + nginx

*cmd:*

docker run -d -p 80 --name website -v $PWD/Project:/var/www/html/website ubuntu/nginx

**-v 这个选项允许我们将宿主机的目录作为卷，加载到容器**

卷可以在容器间共享。即使容器停止了，卷里的内容依旧存在。

具有以下几个价值：

- 希望同时对代码做开发和测试；
- 代码改动很频繁，不想在开发过程中重构镜像；
- 希望在多个容器间共享代码。

