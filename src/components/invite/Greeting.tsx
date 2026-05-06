interface Props {
  title: string;
  body: string;
}

export function Greeting({ title, body }: Props) {
  return (
    <section className="invite-section invite-section--tight">
      <p className="section-title">INVITATION</p>
      <h2 className="section-heading">{title}</h2>
      <p className="greeting-body">{body}</p>
    </section>
  );
}
