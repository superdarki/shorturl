FROM python:3.12-alpine

EXPOSE 8000

COPY . /app

WORKDIR /app

RUN pip install -r requirements.txt

ENTRYPOINT ["fastapi", "run"]