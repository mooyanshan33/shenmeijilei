把字体文件放到本目录并命名为 `ICVE.ttf`。

由于 `https://file.icve.com.cn/file_doc/qdqqd/9421770166017279.ttf` 在多数环境会返回 403，仓库无法自动下载该文件。

引用路径：页面通过 `/fonts/ICVE.ttf` 加载（Vite 的 `public/` 会映射到站点根路径）。
