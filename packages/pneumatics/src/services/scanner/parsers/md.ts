import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'

export const parseMd = (input: string) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)

  return processor.processSync(input)
}
